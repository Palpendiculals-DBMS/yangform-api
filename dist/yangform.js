const API = "http://localhost:4000";

class YangForm {
    constructor(form, options) {
        this.form = form;
        this.options = options;
        this.api = form.api_key;
        this.xhr = new XMLHttpRequest();
        this.init();
    }

    init() {
        const form_div = document.getElementById(this.form?.id);
        if (!form_div) {
            console.error("YangForm: No form found with id: " + this.form.id);
            return;
        }

        this.form_div = form_div;

        this.getFormData();
    }

    sendForm(formData) {
        this.submitButton.innerText = "Sending...";
        this.submitButton.disabled = true;
        axios
            .post(
                `${API}/api/form`,
                {
                    form: formData,
                    formid: this.form.formid,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.api}`,
                    },
                }
            )
            .then((res) => {
                this.submitButton.innerText = "Successfully Submitted";
                this.submitButton.className = "__submit __success";
                this.submitButton.disabled = true;
                console.log(res);
                const submitForm = document.createElement("div");
                submitForm.className = "__submit_form";
                submitForm.innerText = "Form submitted successfully";
                this.formElement.appendChild(submitForm);
            })
            .catch((err) => {
                console.log(err);
                this.submitButton.innerText = "Error Occured";
                this.submitButton.className = "__submit __error";
                const submitForm = document.createElement("div");
                submitForm.className = "__submit_form";
                submitForm.innerText = "Error Occured";
                this.formElement.appendChild(submitForm);
            });
    }

    getFormData() {
        console.log("getFormData");
        axios
            .get(`${API}/formsubmit/f/${this.form.formid}`)
            .then((response) => {
                this.form_data = response.data;
                this.generateForm();
                this.form_div.appendChild(this.formElement);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    generateForm() {
        const form = this.form_data.form;
        this.formElement = document.createElement("form");
        this.formElement.id = this.form_data.id;
        this.formElement.className = "__yangform__form";
        this.formElement.enctype = "multipart/form-data";
        form.map((field) => {
            switch (field.type) {
                case "text":
                case "number":
                    this.createElementInput(field);
                    break;
                case "section":
                    this.createSection(field);
                    break;
                case "radio":
                    this.createRadio(field);
                    break;
                case "checkbox":
                    this.createCheckbox(field);
                    break;
                case "date":
                    this.createElementDate(field);
                    break;
            }
        });
        this.addSubmitButton();
        this.formElement.addEventListener("submit", (e) => {
            e.preventDefault();
            this.submitForm(e);
        });
    }

    submitForm(e) {
        const data = new FormData(this.formElement);
        const formData = {};
        for (const [name, value] of data) {
            if (!formData[name]) formData[name] = value;
            else {
                if (Array.isArray(formData[name])) formData[name].push(value);
                else formData[name] = [formData[name], value];
            }
        }

        this.sendForm(formData);
    }

    addSubmitButton() {
        const submitButton = document.createElement("button");
        submitButton.className = "__submit";
        submitButton.innerText = "Submit";
        this.submitButton = submitButton;
        this.formElement.appendChild(submitButton);
    }

    createElementDate(field) {
        const fieldElement = document.createElement("div");
        fieldElement.className = "__yangform_field";
        const label = document.createElement("label");
        label.innerText = field.title;
        label.className = `__label __${field.type} __${field.id}`;
        fieldElement.appendChild(label);
        const input = document.createElement("input");
        input.type = "date";
        input.className = `__input __${field.type} __${field.id}`;
        input.id = `Q_${field.id}`;
        input.name = `Q_${field.id}`;
        input.placeholder = field.title;
        fieldElement.appendChild(input);
        this.formElement.appendChild(fieldElement);
    }

    createCheckbox(field) {
        const section = document.createElement("div");
        section.className = "__yangform_field";
        const label = document.createElement("label");
        label.innerText = field.title;
        label.className = `__label __${field.type} __${field.id}`;
        section.appendChild(label);

        field.options.map((option) => {
            const checkbox_div = document.createElement("div");
            const input = document.createElement("input");
            input.type = "checkbox";
            input.className = `__input __${field.type} __${field.id}`;
            input.id = `Q_${field.id}`;
            input.name = `Q_${field.id}`;
            input.value = option;
            checkbox_div.appendChild(input);
            const label_checkbox = document.createElement("label");
            label_checkbox.innerText = option;
            checkbox_div.appendChild(label_checkbox);
            section.appendChild(checkbox_div);
        });

        this.formElement.appendChild(section);
    }

    createRadio(field) {
        const section = document.createElement("div");
        section.className = "__yangform_field";
        const label = document.createElement("label");
        label.innerText = field.title;
        label.className = `__label __${field.type} __${field.id}`;
        section.appendChild(label);

        field.options.map((option) => {
            const radio_div = document.createElement("div");
            const input = document.createElement("input");
            input.type = "radio";
            input.className = `__input __${field.type} __${field.id}`;
            input.id = `Q_${field.id}`;
            input.name = `Q_${field.id}`;
            input.value = option;
            radio_div.appendChild(input);
            const label_radio = document.createElement("label");
            label_radio.innerText = option;
            radio_div.appendChild(label_radio);
            section.appendChild(radio_div);
        });

        this.formElement.appendChild(section);
    }

    createSection(field) {
        const section = document.createElement("div");
        section.className = "__yangform_field";
        const description = document.createElement("div");
        description.className = "__yangform_description";
        description.innerText = field.description;
        section.appendChild(description);
        const title = document.createElement("div");
        title.className = "__yangform_title";
        title.innerText = field.title;
        section.appendChild(title);
        this.formElement.appendChild(section);
    }

    createElementInput(field) {
        const fieldElement = document.createElement("div");
        fieldElement.className = "__yangform_field";
        const label = document.createElement("label");
        label.innerText = field.title;
        label.className = `__label __${field.type} __${field.id}`;
        fieldElement.appendChild(label);
        const input = document.createElement("input");
        input.className = `__input __${field.type} __${field.id}`;
        input.id = `Q_${field.id}`;
        input.type = field.type;
        input.name = `Q_${field.id}`;
        input.placeholder = field.title;
        fieldElement.appendChild(input);
        this.formElement.appendChild(fieldElement);
    }
}
