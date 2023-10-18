import { FieldErrors, useForm } from "react-hook-form";

interface LoginForm {
  username: string;
  password: string;
  email: string;
}

export default function Forms() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onChange",
  });

  const onValid = (data: LoginForm) => {
    console.log("valid");
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <input
        {...register("username", { required: "Username is required" })}
        type="text"
        placeholder="Username"
      />
      <input
        {...register("email", {
          required: "Email is required",
          validate: {
            notGmail: (value) =>
              !value.includes("@gmail.com") || "Gmail is not allowed",
          },
        })}
        type="email"
        placeholder="Email"
      />
      {errors.email?.message}
      <input
        {...register("password", {
          required: "Password is required",
          minLength: { value: 5, message: "min length is 5" },
        })}
        type="password"
        placeholder="Password"
      />
      <input type="submit" value="Create Account" />
    </form>
  );
}
