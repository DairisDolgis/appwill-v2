"use client"
import { useForm, FormProvider } from 'react-hook-form';
import { Input, Button, Hint } from '@heathmont/moon-core-tw';
import { signIn } from 'next-auth/react';
import Logo from "../../../components/Logo";


const SignIn = () => {
    const methods = useForm();
    const { register, handleSubmit, formState } = methods;

    const onSubmit = async (data: any) => {
        await signIn("credentials", { userName: data.userName, password: data.password, redirect: true, callbackUrl: "/back-office"  })
    }

    return (
        <div className="grid h-screen bg-slate-50">
        <Logo className="place-self-center self-start pt-4"/>
        <div className="flex gap-4 flex-col bg-white border-2 border-slate-200 rounded-md p-5 justify-center items-center place-self-center self-start">
        <h3 className="text-moon-16 font-medium transition-colors">Log In</h3>
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4 p-4">
                <Input type="text" placeholder="User name" aria-invalid={formState.errors.userName ? "true" : "false"} error={methods.formState.errors.userName ? true : false} {...register("userName", { required: true, })} />
                {formState.errors.userName?.type === "required" && (
                    <Hint error>User name is required</Hint>
                )}
                <Input type="password" placeholder="Password" aria-invalid={formState.errors.password ? "true" : "false"} error={methods.formState.errors.password ? true : false} {...register("password", { required: true, })} />
                {formState.errors.password?.type === "required" && (
                    <Hint error>Password is required</Hint>
                )}
                
                <Button type="submit"  className="text-black">Log In</Button>
                    
            </form>
        </FormProvider>
        </div>
    </div>
    )
}

export default SignIn;