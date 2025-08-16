
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lock } from "lucide-react";

export function LoginForm() {
    return (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white rounded-2xl shadow-2xl">
            <CardHeader className="text-center">
                <div className="mx-auto bg-white/20 rounded-full p-3 w-fit mb-4 border border-white/30">
                    <Lock className="h-6 w-6 text-white"/>
                </div>
                <CardTitle className="text-3xl font-bold text-white">Admin Login</CardTitle>
                <CardDescription className="text-white/80">
                    Enter your credentials to access the admin panel.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email"
                               className="text-white/90">Email</Label>
                        <Input id="email" type="email" placeholder="admin@example.com"
                               className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-white/80"/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password"
                               className="text-white/90">Password</Label>
                        <Input id="password" type="password" placeholder="••••••••"
                               className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:ring-white/80"/>
                    </div>
                    <Button type="submit" className="w-full bg-white text-primary hover:bg-white/90 font-bold py-3 text-base rounded-lg">
                        Login
                    </Button>
                </form>
                <div className="mt-6 text-center text-sm">
                    <Link href="#" className="text-white/70 hover:text-white hover:underline">
                        Forgot password?
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
