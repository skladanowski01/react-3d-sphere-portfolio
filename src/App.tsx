import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import CometCursor from './components/CometCursor';

export default function App() {
  return (
    <div className="flex flex-col justify-between w-full h-screen overflow-hidden font-sans bg-black text-zinc-100">
      <CometCursor />
      <Header />
      <Main />
      <Footer />
    </div>
  );
}