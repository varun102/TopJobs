export class ShortlistApplicants{
    public serialno:number;
    private resumeId:string;
    private jobId:string;
    constructor(resumeId:string,job:string){

        this.resumeId=resumeId;
        this.jobId=job;
    }
}