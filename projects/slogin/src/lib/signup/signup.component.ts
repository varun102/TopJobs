import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SloginService } from '../slogin.service';
import { UsernameValidator } from '../../Validations/Username.Validator';
import { Seeker } from '../models/seeker';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'skl-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponentSeeker implements OnInit {
  countries = [
    
    'India'
   
    
  ];

  states = [
    'Maharashtra',
    'AP', 'MP', 'UP', 'RJ', 'Haryana', 'Bihar'

  ];

  genders = [
    'Male',
    'Female',
    'Other'
  ];


  validation_messages = {
    'firstname': [
      { type: 'pattern', message: 'minimum 4 characters are required' },
      { type: 'required', message: 'First name is required' }
    ],
    'lastname': [
      { type: 'pattern', message: 'minimum 4 characters are required' },
      { type: 'required', message: 'Last name is required' }
    ],
    'bio': [
      { type: 'maxlength', message: 'Profile cannot be more than 256 characters long' },
    ],
    'gender': [
      { type: 'required', message: 'Please select your gender' },
    ],
    'birthday': [
      { type: 'required', message: 'Please insert your birthday' },
    ],
    'phone': [
      { type: 'required', message: 'Phone is required' },
      { type: 'validCountryPhone', message: 'Phone incorrect for the country selected' }
    ],
    'city': [
      { type: 'required', message: 'City is required' },
      { type: 'pattern', message: 'Only Alphabets allowed' }
    ],

    'zipcode': [
      { type: 'required', message: 'Zipcode is required' },
      { type: 'pattern', message: 'Exactly 6 numbers should be there and not starting with 0' }
    ]

  };

  account_validation_messages = {
    'username': [
      { type: 'required', message: 'Username is required' },
      { type: 'minlength', message: 'Username must be at least 5 characters long' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters' },
      { type: 'validUsername', message: 'This username has already been taken' }
    ],
    'email': [
      { type: 'required', message: 'Email is required' },
      { type: 'pattern', message: 'Enter a valid email' }
    ],
    'confirm_password': [
      { type: 'invalid', message: 'Password mismatch' }
    ],
    'password': [
      { type: 'required', message: 'Password is required' },
      { type: 'minlength', message: 'Password must be at least 8 characters long' },
      { type: 'pattern', message: 'Your password must contain at least one uppercase, and one number,one special character' }
    ],
    'terms': [
      { type: 'pattern', message: 'You must accept terms and conditions' }
    ]
  };


  seek: Seeker = new Seeker();
  constructor(private snackBar:MatSnackBar, private FB: FormBuilder, private router: Router, private service: SloginService) { }


  submitted = false;
  userDetailsForm = this.FB.group({
    firstname: ['', [Validators.required, Validators.pattern('^([a-z]|[A-Z]){4,8}$')]],
    lastname: ['', [Validators.required, Validators.pattern('^([a-z]|[A-Z]){4,8}$')]],
    bio: ['dummy text of the printing and typesetting industry.', Validators.maxLength(256)],
    birthday: ['', Validators.required],
    gender: ['', Validators.required],
    phone: ['', Validators.required],
    address: this.FB.group({
      state: ['', Validators.required],
      city: ['', [Validators.required, Validators.pattern('^([a-z]|[A-Z]){4,30}$')]],
      zipcode: ['', [Validators.required, Validators.pattern('^[1-9]{1}[0-9]{5}$')]],
      country: ['', Validators.required],
    }), username: ['', [
      UsernameValidator.validUsername,
      Validators.maxLength(25),
      Validators.minLength(5),
      Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
      Validators.required
    ]],
    email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
    password: ['', [Validators.required, Validators.minLength(8),Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]],
    confirm_password: ['', this.Validpass],
    terms: new FormControl(false, Validators.pattern('true'))
  });


  ngOnInit() {
  }


  onSubmit(obj) {
    this.submitted = true;
    this.seek.firstName = obj.firstname;
    this.seek.lastName = obj.lastname;
    this.seek.password = obj.password;
    this.seek.emailId = obj.email;
    this.seek.dob = obj.birthday;
    this.seek.mobileno = obj.phone;
    this.seek.gender = obj.gender;
    this.seek.bio = obj.bio;
    this.seek.city = obj.address.city;
    this.seek.zipcode = obj.address.zipcode;
    this.seek.country = obj.address.country;
    this.seek.states = obj.address.state;
    this.seek.username = obj.username;

    if (this.userDetailsForm.invalid) {
      return;
    }
    this.service.signUpUser(this.seek).subscribe(data => {
      //alert('User created SuccessFully.'+data);
      if(data != null){
        this.snackBar.open(data.username+" successfully created.","DONE",{duration:3000,verticalPosition:"top"});
        // this.router.navigate(['/seeker/jobs',data.username]);  
        this.router.navigate(['/slogin/login']);  
      }
    });
  }
  Validpass(abstract: AbstractControl) {
    if (abstract && (abstract.value !== null || abstract.value !== undefined)) {
      const cnfpass = abstract.value;

      const pass = abstract.root.get('password'); // -> root->value
      if (pass) {
        const passValue = pass.value;
        if (passValue !== cnfpass || passValue === '') {
          return {
            isError: true
          };
        }
      }
    }

    return null;
  }

  keyDownFunction(event){
    if(event.keyCode==13){
      this.onSubmit(this.userDetailsForm.value);
    }
  }

}
