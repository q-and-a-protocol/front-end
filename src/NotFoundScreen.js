import { Link as RouterLink } from 'react-router-dom';

export function NotFoundScreen() {
  return (
    <>
      <div className='flex min-h-full flex-col bg-white pt-16 pb-12'>
        <main className='mx-auto flex w-full max-w-7xl flex-grow flex-col justify-center px-4 sm:px-6 lg:px-8'>
          <div className='py-16'>
            <div className='text-center'>
              <p className='text-base font-semibold text-indigo-600'>404</p>
              <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>
                Page not found.
              </h1>
              <p className='mt-2 text-base text-gray-500'>
                Sorry, we couldn’t find the page you’re looking for.
              </p>
              <div className='mt-6'>
                <RouterLink
                  to='/'
                  className='text-base font-medium text-indigo-600 hover:text-indigo-500'
                >
                  Go back home
                  <span aria-hidden='true'> &rarr;</span>
                </RouterLink>
              </div>
            </div>
          </div>
        </main>
        <footer className='mx-auto w-full max-w-7xl flex-shrink-0 px-4 sm:px-6 lg:px-8'>
          <nav className='flex justify-center space-x-4'>
            <a
              href='mailto: arshaan.marketing@gmail.com'
              className='text-sm font-medium text-gray-500 hover:text-gray-600'
            >
              Contact Support
            </a>

            {/* <span className='inline-block border-l border-gray-300' aria-hidden='true' />
            <a href='#' className='text-sm font-medium text-gray-500 hover:text-gray-600'>
              Status
            </a> */}
            <span className='inline-block border-l border-gray-300' aria-hidden='true' />
            <a
              href='https://twitter.com/QandAProtocol'
              target='_blank'
              className='text-sm font-medium text-gray-500 hover:text-gray-600'
            >
              Twitter
            </a>
          </nav>
        </footer>
      </div>
    </>
  );
}
