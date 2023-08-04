import Logo from "./components/Logo";
import ProductCodeAuth from "./components/ProductCodeAuth";


export default async function Index() {
  return (
    <div className="grid h-screen bg-slate-50">
      <Logo className="place-self-center self-start pt-4"/>
      <div className="flex gap-4 flex-col bg-white border-2 border-slate-200 rounded-md p-5 justify-center items-center place-self-center self-start">
      <h3 className="text-moon-16 font-medium transition-colors">Enter key code</h3>
      <ProductCodeAuth/>
    </div>
  </div>
  );
}
