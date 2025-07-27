// // src/pages/RegisterPage.tsx
// import React, { useState } from 'react';
// import { useAuth } from '@/context/AuthContext';
// import { useNavigate, useLocation, Link } from 'react-router-dom';
// import { toast } from 'react-hot-toast';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// export default function RegisterPage() {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const { register, loading } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = (location.state as any)?.from?.pathname || '/quiz';

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     if (!username || !password) {
//       toast.error('Please enter both username and password.');
//       return;
//     }
//     try {
//       await register(username, password);
//       navigate(from, { replace: true });
//     } catch {
//       toast.error('Registration failed. Please try again.');
//     }
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
//       <div className="flex-grow flex items-center justify-center p-6">
//         <Card className="w-full max-w-4xl overflow-hidden">
//           <CardContent className="grid md:grid-cols-2">
//             {/* Left: Registration Form */}
//             <div className="p-6 md:p-8">
//               <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
//                 <div className="text-center">
//                   <h1 className="text-2xl font-bold">Create an Account</h1>
//                   <p className="text-muted-foreground">
//                     Register to start using LearnAI
//                   </p>
//                 </div>

//                 <div className="grid gap-2">
//                   <Label htmlFor="username">Username</Label>
//                   <Input
//                     id="username"
//                     type="text"
//                     placeholder="yourusername"
//                     value={username}
//                     onChange={e => setUsername(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className="grid gap-2">
//                   <Label htmlFor="password">Password</Label>
//                   <Input
//                     id="password"
//                     type="password"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <Button type="submit" className="w-full" disabled={loading}>
//                   {loading ? 'Registering…' : 'Register'}
//                 </Button>

//                 <p className="text-center text-sm">
//                   Already have an account?{' '}
//                   <Link to="/login" className="underline underline-offset-4">
//                     Login
//                   </Link>
//                 </p>
//               </form>
//             </div>

//             {/* Right: Illustration */}
//             <div className="hidden md:block relative bg-muted">
//               <img
//                 src="https://previews.123rf.com/images/michaeljung/michaeljung1208/michaeljung120800113/14669221-beautiful-young-female-college-student-portrait.jpg"
//                 alt="Register illustration"
//                 className="absolute inset-0 h-full w-full object-cover "
//               />
//               {/* dark:brightness-[0.2] dark:grayscale */}
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <footer className="text-center text-xs text-muted-foreground py-4">
//         By registering, you agree to our{' '}
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
