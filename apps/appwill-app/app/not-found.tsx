import Logo from "./components/Logo";

function NotFound() {

  return (
    <div className="grid h-screen bg-slate-50">
      <Logo className="place-self-center self-start pt-4"/>
      <div className="flex gap-4 flex-col bg-white border-2 border-slate-200 rounded-md p-5 justify-center items-center place-self-center self-start">
      <h3 className="text-moon-32 font-medium transition-colors">404</h3>
      <h3 className="text-moon-16 font-medium transition-colors">This page does not exist</h3>
      </div>
    </div>
  )
}

export default NotFound;
