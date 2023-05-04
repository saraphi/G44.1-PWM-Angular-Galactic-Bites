import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { Form } from 'src/app/models/form';
import { AuthService } from 'src/app/services/database/firebase-auth.service';

@Component({
  	selector: 'app-login-form',
  	templateUrl: './login-form.component.html',
  	styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements Form {
	loginForm: FormGroup;

	@ViewChildren('input') inputs!: QueryList<ElementRef>;
	@ViewChild('email') email!: ElementRef;
	@ViewChild('password') password!: ElementRef;
	
	constructor(private router: Router, private fb: FormBuilder, private authServices:AuthService) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, PasswordValidator.strong()]]
		});
	}

	onError(input: ElementRef): void {
		input.nativeElement.style.boxShadow = '0px 0px 10px rgb(255, 70, 92)';
	}
	
	checkErrors(): boolean {
		let errors: boolean = false;

		this.inputs.forEach((input, index) => {
			const control = this.loginForm.controls[Object.keys(this.loginForm.controls)[index]];

			if (control.errors) {
				this.onError(input);
				errors = true;
			}
		});

		return errors;
	}

	resetErrors(): void {
		this.inputs.forEach((input) => {
			input.nativeElement.style.boxShadow = 'none';
		});
	}

	signUp(): void {
		this.router.navigate(['signup']);
	}

	onSubmit(): void { 
		console.log(this.loginForm.value);
		const pipo = this.authServices.login(this.loginForm.value);
	
		
		this.resetErrors();
		if (!this.checkErrors()) {
			let email: string = this.loginForm.value.email;
			let password: string = this.loginForm.value.password;

			if (this.userService.login(email, password)) this.router.navigate(['profile']);
			
			if (!this.userService.emailExists(email)) {
				console.log('email doesn\'t exists');
				this.onError(this.email);
			}
			if (!this.userService.checkPassword(email, password)) {
				console.log('password does not match');
				this.onError(this.password); 
			}
		}
	}
}