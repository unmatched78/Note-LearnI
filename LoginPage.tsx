// // src/pages/LoginPage.tsx
// import React, { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { login, loading } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = (location.state as any)?.from?.pathname || '/quiz';

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!email || !password) {
//       toast.error('Please enter both username and password.');
//       return;
//     }
//     try {
//       await login(email, password);
//       navigate(from, { replace: true });
//     } catch {
//       toast.error('Login failed. Please check your credentials.');
//     }
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
//       <div className="flex-grow flex items-center justify-center p-6">
//         <Card className="w-full max-w-4xl overflow-hidden">
//           <CardContent className="grid md:grid-cols-2">
//             {/* Left: Form */}
//             <div className="p-6 md:p-8">
//               <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
//                 <div className="text-center">
//                   <h1 className="text-2xl font-bold">Welcome back</h1>
//                   <p className="text-muted-foreground">
//                     Login to your LearnAI account
//                   </p>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label htmlFor="username">Username</Label>
//                   <Input
//                     id="email"
//                     type="username"
//                     placeholder="example"
//                     value={email}
//                     onChange={e => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="grid gap-2">
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="password">Password</Label>
//                     <Link
//                       to="/forgot-password"
//                       className="text-sm underline-offset-2 hover:underline"
//                     >
//                       Forgot password?
//                     </Link>
//                   </div>
//                   <Input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <Button type="submit" className="w-full" disabled={loading}>
//                   {loading ? 'Logging in…' : 'Login'}
//                 </Button>

//                 <div className="relative text-center text-sm">
//                   <span className="bg-card px-2 text-muted-foreground">
//                     Or continue with
//                   </span>
//                   <div className="absolute inset-0 top-1/2 border-t border-border" />
//                 </div>

//                 <div className="grid grid-cols-3 gap-4">
//                   <Button variant="outline" className="w-full" type="button">
//                     {/* Apple SVG */}
//                     <svg /* ... */ />
//                     <span className="sr-only">Login with Apple</span>
//                   </Button>
//                   <Button variant="outline" className="w-full" type="button">
//                     {/* Google SVG */}
//                     <svg /* ... */ />
//                     <span className="sr-only">Login with Google</span>
//                   </Button>
//                   <Button variant="outline" className="w-full" type="button">
//                     {/* Meta SVG */}
//                     <svg /* ... */ />
//                     <span className="sr-only">Login with Meta</span>
//                   </Button>
//                 </div>

//                 <p className="text-center text-sm">
//                   Don’t have an account?{' '}
//                   <Link to="/register" className="underline underline-offset-4">
//                     Sign up
//                   </Link>
//                 </p>
//               </form>
//             </div>

//             {/* Right: Illustration */}
//             <div className="hidden md:block relative bg-muted">
//               <img
//                 src="https://previews.123rf.com/images/michaeljung/michaeljung1208/michaeljung120800113/14669221-beautiful-young-female-college-student-portrait.jpg"
//                 alt="Learning illustration"
//                 className="absolute inset-0 h-full w-full object-cover"
//               />
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <footer className="text-center text-xs text-muted-foreground py-4">
//         By continuing, you agree to our{' '}
//         <Link to="/terms" className="underline underline-offset-2">
//           Terms of Service
//         </Link>{' '}
//         and{' '}
//         <Link to="/privacy" className="underline underline-offset-2">
//           Privacy Policy
//         </Link>
//         .
//       </footer>
//     </div>
//   );
// }
