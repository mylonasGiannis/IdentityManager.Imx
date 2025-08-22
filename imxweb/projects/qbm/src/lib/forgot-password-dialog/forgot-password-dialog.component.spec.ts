// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { ForgotPasswordDialogComponent } from './forgot-password-dialog.component';

// describe('ForgotPasswordDialogComponent', () => {
//   let component: ForgotPasswordDialogComponent;
//   let fixture: ComponentFixture<ForgotPasswordDialogComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ForgotPasswordDialogComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(ForgotPasswordDialogComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });



import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ForgotPasswordDialogComponent } from './forgot-password-dialog.component';

// Mock Services
class MockAuthenticationService {
  preAuthVerify = jasmine.createSpy('preAuthVerify').and.returnValue(Promise.resolve());
}

class MockCaptchaService {
  Response = 'mock-captcha-response';
  ReinitCaptcha = jasmine.createSpy('ReinitCaptcha');
}

class MockAppConfigService {
  apiClient = {
    processRequest: jasmine.createSpy('processRequest').and.returnValue(Promise.resolve(" Event executed successfully!"))
  };
}

class MockSnackBarService {
  open = jasmine.createSpy('open');
}

class MockDialogRef {
  close = jasmine.createSpy('close');
}

describe('ForgotPasswordDialogComponent', () => {
  let component: ForgotPasswordDialogComponent;
  let fixture: ComponentFixture<ForgotPasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForgotPasswordDialogComponent],
      providers: [
        FormBuilder,
        { provide: 'AuthenticationService', useClass: MockAuthenticationService },
        { provide: 'CaptchaService', useClass: MockCaptchaService },
        { provide: 'AppConfigService', useClass: MockAppConfigService },
        { provide: 'SnackBarService', useClass: MockSnackBarService },
        { provide: 'MatDialogRef', useClass: MockDialogRef }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
