import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Form } from 'src/app/models/form';
import { CreditCardValidator } from 'src/app/validators/credit-card.validator';

@Component({
    selector: 'app-payment-form',
    templateUrl: './payment-form.component.html',
    styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent implements Form {
    paymentForm: FormGroup;

    @ViewChildren('input') inputs!: QueryList<ElementRef>; 
        
    constructor(private router: Router, private fb: FormBuilder) {
        this.paymentForm = this.fb.group({
            num: ['', [Validators.required, CreditCardValidator.number()]],
            name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40), CreditCardValidator.nameOnCard()]],
            date: ['', [Validators.required, CreditCardValidator.date()]],
            cvv: ['', [Validators.required, CreditCardValidator.cvv()]],
            address: ['', [Validators.required, Validators.minLength(4)]]
        })
    } 

    onError(input: ElementRef): void {
        input.nativeElement.style.boxShadow = '0px 0px 10px rgb(255, 70, 92)';
    }
    
    checkErrors(): boolean {
        let errors: boolean = false;

		this.inputs.forEach((input, index) => {
			const control = this.paymentForm.controls[Object.keys(this.paymentForm.controls)[index]];

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

    onSubmit(): void {
        console.log(this.paymentForm.value);

        this.resetErrors();
        if (!this.checkErrors()) console.log("no hay errores");
    }
}