import { LoginButton } from './LoginButton';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
            VocabFlow
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Learn vocabulary with spaced repetition
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Sign in to continue
          </h2>
          <LoginButton />
        </div>
      </div>
    </div>
  );
}
