import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { cn } from '@/lib/utils';

const menuItems = [
    { name: 'Features', href: '#features' },
    { name: 'Platforms', href: '#platforms' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Pricing', href: '/pricing' },
];

const Logo = () => {
    return (
        <img 
            src="/brushly_logo-removebg-preview.png" 
            alt="Brushly Logo" 
            className="h-16 w-17 object-contain"
        />
    );
};

export const ModernHeader = () => {
    const navigate = useNavigate();
    const [menuState, setMenuState] = React.useState(false);
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-4 group">
                <div className={cn('mx-auto mt-3 max-w-7xl px-6 transition-all duration-300 lg:px-10', isScrolled && 'bg-white/10 max-w-5xl rounded-full border border-white/20 backdrop-blur-md lg:px-6')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-4 py-2 lg:gap-0 lg:py-3">
                        <div className="flex w-full justify-between lg:w-auto">
                            <button
                                onClick={() => navigate('/')}
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </button>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200 text-white" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200 text-white" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        {item.href.startsWith('/') ? (
                                            <button
                                                onClick={() => navigate(item.href)}
                                                className="text-slate-200 hover:text-cyan-300 block duration-150">
                                                <span>{item.name}</span>
                                            </button>
                                        ) : (
                                            <a
                                                href={item.href}
                                                className="text-slate-200 hover:text-cyan-300 block duration-150">
                                                <span>{item.name}</span>
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-slate-900/95 group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-2xl border border-slate-700 p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            {item.href.startsWith('/') ? (
                                                <button
                                                    onClick={() => {
                                                        navigate(item.href);
                                                        setMenuState(false);
                                                    }}
                                                    className="text-slate-200 hover:text-cyan-300 block duration-150">
                                                    <span>{item.name}</span>
                                                </button>
                                            ) : (
                                                <a
                                                    href={item.href}
                                                    onClick={() => setMenuState(false)}
                                                    className="text-slate-200 hover:text-cyan-300 block duration-150">
                                                    <span>{item.name}</span>
                                                </a>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full justify-center lg:justify-end">
                                <RainbowButton
                                    onClick={() => navigate('/auth')}
                                    className="text-white font-semibold"
                                >
                                    Join Waitlist
                                </RainbowButton>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
};
