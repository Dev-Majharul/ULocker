import Image from "next/image";

export default function Home() {
  return (
    <div className="container mx-auto text-center text-foreground">
      <div className="flex items-center justify-center">
        <Image src="/images/logo.svg" alt="ShadCN UI Logo" width={100} height={100} />
        <h1 className="text-4xl font-bold">ShadCN UI</h1>
      </div>
      <p className="text-lg">A modern UI library for Next.js</p>
      <p className="text-sm">Made with ❤️ by Shad Mirza</p>
      <div className="flex items-center justify-center gap-4 mt-8">
      
      <Image src="/images/hero.jpg" alt="Hero Image" width={1920} height={1080} />
      <h1 className="text-4xl font-bold text-center">Welcome to ShadCN UI</h1>
      <p className="text-center">A modern UI library for Next.js</p>
      <h1>Home</h1>
      
      <p>Home Page test </p>
      </div>
    </div>
  );
}
