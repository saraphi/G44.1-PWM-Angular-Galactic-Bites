import { Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MultiForm } from 'src/app/models/multi-form';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { PhoneValidator } from 'src/app/validators/phone.validator';

@Component({
  selector: 'app-edit-profile-popup',
  templateUrl: './edit-profile-popup.component.html',
  styleUrls: ['./edit-profile-popup.component.scss']
})
export class EditProfilePopupComponent implements OnInit, MultiForm {

  @Input() user: User | null = null;

  phoneForm: FormGroup;
  nameForm: FormGroup;
  emailForm: FormGroup;
  passwordForm: FormGroup;

  @Output() close: EventEmitter<void> = new EventEmitter<void>();

  @ViewChildren('input') inputs: QueryList<ElementRef>;

  @ViewChildren('tel') phoneInputs: QueryList<ElementRef>;
  @ViewChildren('name') nameInputs: QueryList<ElementRef>;
  @ViewChildren('email') emailInputs: QueryList<ElementRef>;
  @ViewChildren('password') passwordInputs: QueryList<ElementRef>;

  @ViewChild('email') emailInput: ElementRef;
  @ViewChild('old') oldPasswordInput: ElementRef;
  @ViewChild('confirm') confirmPasswordInput: ElementRef;

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.phoneForm = this.fb.group({
      tel: ['', [Validators.required, PhoneValidator.validPhoneNumber()]]
    });

    this.nameForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
    });

    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, PasswordValidator.strong()]],
      confirmPassword: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    if (!this.user) return;

    this.phoneForm.setValue({ tel: this.user.phone });
    this.nameForm.setValue({ name: this.user.name });
    this.emailForm.setValue({ email: this.user.email });
  }

  onError(input: ElementRef<any>): void {
    input.nativeElement.style.boxShadow = '0px 0px 10px rgb(255, 70, 92)';
  }

  checkErrors(form: FormGroup<any>, inputs: QueryList<ElementRef<any>>): boolean {
    let errors: boolean = false;

		inputs.forEach((input, index) => {
			const control = form.controls[Object.keys(form.controls)[index]];

			if (control.errors) {
				this.onError(input);
				errors = true;
			}
		});

		return errors;
  }

  resetErrors(): void {
    this.inputs.forEach((input) => input.nativeElement.style.boxShadow = 'none');
  }
  
  checkPasswords(): boolean {
		let match: boolean = false;

		if (this.passwordForm.value.newPassword == this.passwordForm.value.confirmPassword) match = true;
		else this.onError(this.confirmPasswordInput);

		return match;
	}

  checkPasswordFormNotEmpty(): boolean {
    return this.passwordForm.value.oldPassword || this.passwordForm.value.newPassword || this.passwordForm.value.confirmPassword;
  }

  onClose(): void {
    //this.close.emit();
  }

  async save(): Promise<void> {
    if (!this.user) return;

    this.resetErrors();

    let user: User = this.user;
    
    if (this.phoneForm.value.tel != this.user.phone && this.checkErrors(this.phoneForm, this.phoneInputs)) return;
    else user.phone = this.phoneForm.value.tel;

    if (this.nameForm.value.name != this.user.name && this.checkErrors(this.nameForm, this.nameInputs)) return;
    else user.name = this.nameForm.value.name;

    let errors: boolean = false;

    if (this.emailForm.value.email != this.user.email && this.checkErrors(this.emailForm, this.emailInputs)) return;
    else if (this.emailForm.value.email != this.user.email) {
      
      // aqui iría el cambio de email, que debe devolver un booleano falso
      // en caso de que ya exista el email. ejemplo:
      // this.userService.updateEmail(this.user.id, this.emailForm.value.email).then(
      //  (value: boolean) => {
      //    if (!value) {
      //      errors = true;
      //      this.onError(this.emailInput);
      //    } 
      //    else user.email = this.emailForm.value.email;
      // })
      console.log("Se para")
      //await this.userService.updateEmail(this.emailForm.value.email).then((booleano) => { return booleano })
    }

    if (this.checkPasswordFormNotEmpty() && this.checkErrors(this.passwordForm, this.passwordInputs)) return;
    else if (this.checkPasswordFormNotEmpty()) {
      let match: boolean = this.checkPasswords();
      if (match) {
        // aquí iría el cambio de contraseña, si da error debe devolver un booleano 
        // falso en caso de que la contraseña no sea correcta, ejemplo:
        // this.userService.updatePassword(this.passwordForm.value.oldPassword, this.passwordForm.value.newPassword).then(
        //  (value: boolean) => {
        //    if (!value) {
        //      errors = true;
        //      this.onError(this.oldPasswordInput);
        //    }    
        // })
      }
    }

    if (errors) return;

    // aquí iría el update user, debe devolver un booleano. (puedes pasar el user completo o
    // los valores necesarios por separado como user.phone, user.name) ejemplo:
    // this.userService.update(user).then(
    //  (value: boolean) => if (!value) return
    // )

    //this.onClose();
  }
}