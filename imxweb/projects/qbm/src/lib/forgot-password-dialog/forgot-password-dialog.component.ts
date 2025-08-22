import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MethodDescriptor, TimeZoneInfo } from '@imx-modules/imx-qbm-dbts';
import { AppConfigService } from '../appConfig/appConfig.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { CaptchaService } from '../captcha/captcha.service';
import { SnackBarService } from '../snackbar/snack-bar.service';

interface ValidationError{
  column: string;
  errorMsg:string;
}

@Component({
  selector: 'imx-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrl: './forgot-password-dialog.component.scss'
})
export class ForgotPasswordDialogComponent implements OnInit{

  captchaVerified = false;
  form: FormGroup;
  email:string;

  constructor(private fb: FormBuilder,
              private captchaService: CaptchaService,
              private authentication: AuthenticationService,
              private config: AppConfigService,
              private readonly snackbar: SnackBarService,
              private dialogRef: MatDialogRef<ForgotPasswordDialogComponent>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onCaptchaVerified(): void {
    this.captchaVerified = true;
  }

  get isFormValid(): boolean {
    return this.form.valid && !!this.captchaService.Response;
  }

  async onSubmit(): Promise<void> {
    if (!this.isFormValid) {
      this.form.markAllAsTouched();
      return;
    }
  
    this.email = this.form.get('email')?.value;
  
    try {
      await this.authentication.preAuthVerify(this.captchaService.Response);
      
      const result = await this.PostApi(this.convertData());
      console.log(result);
      if(result===" Event executed successfully!"){
        this.snackbar.open({
          key: 'Password reset request submitted successfully!'
        });

        this.dialogRef.close();
      }else{
        this.snackbar.open({
          key: 'Your email is wrong! Try again!'
        });
        this.form.get('email')?.reset('');
        this.captchaService.Response = '';
        this.captchaService.ReinitCaptcha();

       
      }
    
    } catch (error) {
      this.snackbar.open({
        key: 'Incorrect captcha'
      });
      
      this.captchaService.Response = '';
      this.captchaService.ReinitCaptcha();
    }
  }

  private convertData(){
    let finalData={ 
      "Email":this.email.toString()
    };
    return finalData;
  }

  public async PostApi(data:any):Promise<string>{
    let result=await this.config.apiClient.processRequest(this.validateAPICall(data));
    return result.toString();
  }

  private validateAPICall( data: any): MethodDescriptor<ValidationError[]> {
    return {
        path: `/portal/example/passreset`,
        parameters: [
            {
                name: 'data',
                value: data,
                in: 'body',
            },
        ],
        method: 'POST',
        headers: {
            'imx-timezone': TimeZoneInfo.get(),
        },
        credentials: 'include',
        observe: 'response',
        responseType: 'json',
    };
}



}
