"use client"
import { AuthCode, Button, Form } from '@heathmont/moon-core-tw';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation'

const schema = z.object({
  authCode: z.string().length(6, { message: 'Must be exactly 6 characters long' }),
});

type ValidationSchema = z.infer<typeof schema>;

const ProductCodeAuth = () => {
    const router = useRouter()
  const { control, handleSubmit, formState: { isValid, isDirty } } = useForm({
    defaultValues: {
      authCode: '',
    },
    resolver: zodResolver(schema)
  });

  const onSubmit: SubmitHandler<ValidationSchema> =
    (data: ValidationSchema) => router.push(`/product/${data.authCode}`);

  return (
    <Form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-2'
    >
      <Controller
        name='authCode'
        control={control}
        render={({ field }) => <AuthCode {...field} allowedCharacters='numeric' autoFocus />}
      />
      <Button className='bg-appwill-cream text-black' as='button' type='submit' disabled={!isDirty || !isValid}>
        Enter
      </Button>
    </Form>
  );
};

export default ProductCodeAuth;