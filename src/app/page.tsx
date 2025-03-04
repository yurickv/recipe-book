import Link from "next/link";

export default function Home() {
  return (
    <div className=''>
      <main className='flex justify-center'>
        <Link
          href='/recipes'
          className='p-3 bg-gray-300 hover:bg-gray-200 text-xl  mt-10 rounded-lg text-gray-900'
        >
          Get all recipes
        </Link>
      </main>
      <footer className='row-start-3 flex gap-6 flex-wrap items-center justify-center'></footer>
    </div>
  );
}
