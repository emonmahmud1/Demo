export const nameValidation = {
    name: {
      required: true,
      maxLength: {
        value: 50,
        message: "should not be more then 50 characters."
      },
      pattern: {
        value: /^[A-Za-z][A-Za-z\s]*\d?$/,
        message: "Name should be string",
      },
      
    },
    id: {
      required: true,
      maxLength: {
        value: 4,
        message: "should not be more then 4 number."
      },
      pattern: {
        value: /^\d+$/,
        message: "Id should be number",
      },
      
    },
    name_bn: {
      required: true,
      maxLength: {
        value: 50,
        message: "should not be more then 50 characters."
      },
      pattern: {
        value: /^[A-Za-z][A-Za-z\s]*\d?$/,
        message: "Name should be string",
      },

      
    },
    password: {
        required:true,
        minLength:{
            value:6,
            message: "password should be at least 6 character"
        }
    },
    email: {
        required:true,
        pattern:{
            value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Please Provide Valid Email"

        }

    },
    email_tags: {
        required:false,
        pattern:{
            value:/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Please Provide Valid Email"

        }

    },
    phone: {
        required:true,
        pattern:{
            value:/^(\+?[0-9]{11})$/,
            message: "Please Provide Valid phone number"

        }

    },
    string: {
        required:true,
        pattern:{
            value:/.+/,
            message:"please provide valid string"

        }
    }
  };