'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { TypeAnimation } from 'react-type-animation';
import { fetchuser } from '@/actions/useractions';
import { ToastContainer, toast } from 'react-toastify';
import { useSearchParams } from "next/navigation";
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Username() {
    const router = useRouter(); // Add this line

    const searchParams = useSearchParams();

    const { username } = useParams();
    

    const [scrolled, setScrolled] = useState(false);
    const [user, setUser] = useState({});
    const [activeTab, setActiveTab] = useState('home');
    const [userNotFound, setUserNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ duration: 1200, once: true });

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    useEffect(() => {
        if (!username) return;
        getData();
    }, [username]);

    useEffect(() => {
        const isDone = searchParams.get("paymentdone");
        console.log("paymentdone param:", isDone);

        if (isDone === "true") {
            toast.success('Thanks for Your donation', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
                transition: Bounce,
            });

            const url = new URL(window.location.href);
            url.searchParams.delete("paymentdone");
            window.history.replaceState({}, "", url.pathname);
        }
    }, [searchParams]);
    const getData = async () => {
        try {
            const userData = await fetchuser(username);
            console.log(username);
            console.log('User data:', userData);
            setUser(userData);
        } catch (error) {
            console.error('Error fetching user:', error);
            router.push('/404');
        }
    }

    const projects = [
        {
            title: 'AI Chatbot',
            description: 'An intelligent chatbot powered by GPT-3 with natural language processing capabilities and seamless user interaction.',
            link: 'https://github.com/amitkumar/ai-chatbot',
            tech: ['React', 'OpenAI', 'Node.js'],
            gradient: 'from-blue-500 to-cyan-500',
            icon: '🤖'
        },
        {
            title: 'Portfolio Website',
            description: 'A stunning personal portfolio showcasing projects and technical skills with modern animations and responsive design.',
            link: 'https://amitkumar.dev',
            tech: ['Next.js', 'Tailwind', 'Framer Motion'],
            gradient: 'from-purple-500 to-pink-500',
            icon: '🎨'
        },
        {
            title: 'E-commerce Platform',
            description: 'A full-featured e-commerce platform with modern payment integration, inventory management, and analytics.',
            link: 'https://github.com/amitkumar/ecommerce-platform',
            tech: ['React', 'Stripe', 'MongoDB'],
            gradient: 'from-green-500 to-teal-500',
            icon: '🛒'
        },
        {
            title: 'Task Management App',
            description: 'A collaborative task management application with real-time updates, team collaboration, and progress tracking.',
            link: 'https://github.com/amitkumar/task-manager',
            tech: ['Vue.js', 'Socket.io', 'Express'],
            gradient: 'from-orange-500 to-red-500',
            icon: '📋'
        },
        {
            title: 'Data Visualization Dashboard',
            description: 'Interactive dashboard for complex data visualization with real-time charts, filters, and export capabilities.',
            link: 'https://github.com/amitkumar/data-viz',
            tech: ['D3.js', 'React', 'Python'],
            gradient: 'from-indigo-500 to-blue-500',
            icon: '📊'
        },
        {
            title: 'Mobile Banking App',
            description: 'Secure mobile banking application with biometric authentication, transaction history, and budget tracking.',
            link: 'https://github.com/amitkumar/mobile-banking',
            tech: ['React Native', 'Firebase', 'Stripe'],
            gradient: 'from-emerald-500 to-cyan-500',
            icon: '💳'
        }
    ];

    const skills = [
        { name: 'JavaScript', level: 95, icon: '🟨', category: 'Frontend' },
        { name: 'React', level: 90, icon: '⚛️', category: 'Frontend' },
        { name: 'Node.js', level: 85, icon: '🟢', category: 'Backend' },
        { name: 'Next.js', level: 88, icon: '▲', category: 'Frontend' },
        { name: 'TypeScript', level: 82, icon: '🔷', category: 'Language' },
        { name: 'Python', level: 78, icon: '🐍', category: 'Backend' },
        { name: 'Tailwind CSS', level: 92, icon: '🎨', category: 'Styling' },
        { name: 'MongoDB', level: 80, icon: '🍃', category: 'Database' },
        { name: 'PostgreSQL', level: 75, icon: '🐘', category: 'Database' },
        { name: 'Docker', level: 70, icon: '🐳', category: 'DevOps' },
        { name: 'AWS', level: 68, icon: '☁️', category: 'Cloud' },
        { name: 'GraphQL', level: 73, icon: '📊', category: 'API' }
    ];

    const skillCategories = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Cloud'];
    const [activeSkillCategory, setActiveSkillCategory] = useState('All');

    const filteredSkills = activeSkillCategory === 'All'
        ? skills
        : skills.filter(skill => skill.category === activeSkillCategory);

    return (
        <>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />

            <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#040404cc' }}>
                {/* Enhanced Background Effects */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, #06b6d4 1px, transparent 0)`,
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>

                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-60 right-32 w-80 h-80 bg-gradient-to-r from-purple-400/8 to-pink-400/8 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-32 left-1/3 w-96 h-96 bg-gradient-to-r from-blue-600/8 to-cyan-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
                </div>

                <div className="relative min-h-screen text-white overflow-x-hidden">
                    {/* Enhanced Header Section */}
                    <div className="relative">
                        {/* Cover Image with Enhanced Holographic Effect */}
                        <div className="h-96 lg:h-[500px] relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 via-pink-400/20  to-green-400/20 animate-pulse"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/15 via-purple-500/15 to-pink-500/15"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                            {/* Floating Elements */}
                            <div className="absolute top-10 left-10 w-4 h-4 bg-cyan-400/60 rounded-full animate-bounce"></div>
                            <div className="absolute top-20 right-20 w-3 h-3 bg-purple-400/60 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                            <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-pink-400/60 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
                        </div>

                        {/* Enhanced Profile Section */}
                        <div className="relative -mt-24 z-10 pb-16">
                            <div className="max-w-6xl mx-auto px-6 text-center">
                                {/* Profile Picture */}
                                <div className="relative inline-block mb-8">
                                    <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur-lg opacity-40 animate-pulse"></div>
                                    <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-full border-4 border-black/50 shadow-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                                        {user?.profilePic ? (
                                            <Image
                                                src={user.profilePic}
                                                alt="Profile"
                                                width={192}
                                                height={192}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-6xl">
                                                👨‍💻
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Name and Title */}
                                <h1 className="text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-4 drop-shadow-lg">
                                   {user.name}
                                </h1>
                                <p className="text-gray-300 text-xl lg:text-2xl mb-8 font-light">
                                    Full-Stack Developer & Code Architect
                                </p>

                                {/* Enhanced Stats */}
                                <div className="flex flex-wrap items-center justify-center gap-8 text-gray-400 mb-12">
                                    <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/50">
                                        <span className="text-xl">💻</span>
                                        <span className="font-medium">5+ Years Experience</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/50">
                                        <span className="text-xl">🎯</span>
                                        <span className="font-medium">50+ Projects</span>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 border border-gray-700/50">
                                        <span className="text-xl">⭐</span>
                                        <span className="font-medium">100+ Happy Clients</span>
                                    </div>
                                </div>

                                {/* Enhanced CTA Button */}
                                <Link
                                    href={`/${username}/payment`}
                                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold text-lg px-10 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-pink-500/25 group"
                                >
                                    <span className="text-2xl group-hover:animate-bounce">💝</span>
                                    <span>Support My Work</span>
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Navigation Tabs */}
                    <div className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-gray-800/50 shadow-lg">
                        <div className="max-w-6xl mx-auto px-6">
                            <nav className="flex justify-center space-x-12 py-6">
                                {['home', 'about', 'skills', 'projects'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`relative pb-3 px-4 font-semibold text-lg transition-all duration-300 ${activeTab === tab
                                            ? 'text-white'
                                            : 'text-gray-400 hover:text-gray-300'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        {activeTab === tab && (
                                            <div className="absolute -bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"></div>
                                        )}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Enhanced Content Area */}
                    <div className="max-w-6xl mx-auto px-6 py-16">
                        {/* HOME TAB */}
                        {activeTab === 'home' && (
                            <div className="space-y-20">
                                {/* Welcome Message */}
                                <div className="text-center space-y-12" data-aos="fade-up">
                                    <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 text-cyan-300 text-base font-medium backdrop-blur-sm">
                                        ✨ Welcome to my digital realm
                                    </div>

                                    <TypeAnimation
                                        sequence={[
                                            'Full-Stack Developer 🚀', 2000,
                                            'React Specialist ⚛️', 2000,
                                            'AI Enthusiast 🤖', 2000,
                                            'Problem Solver 💡', 2000,
                                            'Code Architect 🏗️', 2000
                                        ]}
                                        speed={50}
                                        repeat={Infinity}
                                        className="text-3xl lg:text-5xl text-cyan-300 font-bold drop-shadow-[0_0_15px_cyan]"
                                    />

                                    <p className="text-gray-300 leading-relaxed text-xl lg:text-2xl max-w-4xl mx-auto tracking-wide font-light">
                                        Crafting digital experiences that blend{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-semibold">
                                            innovation
                                        </span>{' '}
                                        with{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
                                            artistry
                                        </span>
                                    </p>
                                </div>

                                {/* Features Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8" data-aos="fade-up" data-aos-delay="200">
                                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-8 text-center hover:border-cyan-500/30 transition-all duration-300">
                                        <div className="text-4xl mb-4">🎨</div>
                                        <h3 className="text-xl font-bold text-cyan-300 mb-3">Creative Design</h3>
                                        <p className="text-gray-400">Beautiful, intuitive interfaces that users love to interact with.</p>
                                    </div>
                                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-8 text-center hover:border-purple-500/30 transition-all duration-300">
                                        <div className="text-4xl mb-4">⚡</div>
                                        <h3 className="text-xl font-bold text-purple-300 mb-3">Fast Performance</h3>
                                        <p className="text-gray-400">Optimized code that delivers lightning-fast user experiences.</p>
                                    </div>
                                    <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-gray-800/50 p-8 text-center hover:border-pink-500/30 transition-all duration-300">
                                        <div className="text-4xl mb-4">📱</div>
                                        <h3 className="text-xl font-bold text-pink-300 mb-3">Mobile First</h3>
                                        <p className="text-gray-400">Responsive designs that work perfectly on all devices.</p>
                                    </div>
                                </div>

                                {/* CTA Section */}
                                <div className="text-center space-y-8 bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-sm rounded-3xl border border-gray-800/50 p-12" data-aos="fade-up" data-aos-delay="400">
                                    <h3 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                                        Ready to Build Something Amazing?
                                    </h3>
                                    <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                                        Let's collaborate and turn your vision into a digital masterpiece that stands out from the crowd.
                                    </p>

                                    <Link
                                        href={`/${username}/payment`}
                                        className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 hover:from-cyan-600/30 hover:to-purple-600/30 border border-cyan-500/30 text-white font-semibold text-xl px-12 py-5 rounded-full transition-all duration-300 hover:scale-105 backdrop-blur-sm group"
                                    >
                                        <span className="text-2xl group-hover:animate-pulse">⚡</span>
                                        <span>Support My Work</span>
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* ABOUT TAB */}
                        {activeTab === 'about' && (
                            <div className="space-y-16" data-aos="fade-up">
                                <div className="bg-gradient-to-br from-black/40 to-black/20 backdrop-blur-sm rounded-3xl border border-gray-800/50 p-12 lg:p-16">
                                    <h3 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-8">
                                        About {name || 'the Creator'}
                                    </h3>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                        <div className="space-y-8 text-lg lg:text-xl leading-relaxed">
                                            <p className="text-gray-300">
                                                Passionate about transforming ideas into reality through elegant code. With expertise spanning
                                                from intuitive frontend interfaces to robust backend architectures, I create digital solutions
                                                that make a difference in people's lives.
                                            </p>

                                            <p className="text-gray-300">
                                                <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                                                    {name || 'This developer'}
                                                </span> specializes in modern web technologies, AI integration, and scalable system design.
                                                Every project is an opportunity to push boundaries and deliver exceptional user experiences.
                                            </p>

                                            <p className="text-gray-300">
                                                When not coding, you'll find me exploring the latest tech trends, contributing to open-source projects,
                                                and mentoring the next generation of developers.
                                            </p>
                                        </div>

                                        <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/20">
                                            <h4 className="text-2xl font-bold text-cyan-300 mb-6">What I Bring</h4>
                                            <ul className="space-y-4 text-gray-300">
                                                <li className="flex items-center space-x-3">
                                                    <span className="text-cyan-400">✓</span>
                                                    <span>5+ years of professional experience</span>
                                                </li>
                                                <li className="flex items-center space-x-3">
                                                    <span className="text-purple-400">✓</span>
                                                    <span>Full-stack development expertise</span>
                                                </li>
                                                <li className="flex items-center space-x-3">
                                                    <span className="text-pink-400">✓</span>
                                                    <span>Modern tech stack proficiency</span>
                                                </li>
                                                <li className="flex items-center space-x-3">
                                                    <span className="text-green-400">✓</span>
                                                    <span>Agile development practices</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>

                                    <blockquote className="relative mt-12 p-8 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl border-l-4 border-cyan-400">
                                        <div className="absolute -left-2 -top-2 text-6xl text-cyan-500/30">"</div>
                                        <p className="italic text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 text-xl lg:text-2xl font-medium pl-8">
                                            Code is poetry written in logic, and every bug is just a plot twist waiting to be resolved.
                                        </p>
                                    </blockquote>
                                </div>
                            </div>
                        )}

                        {/* SKILLS TAB */}
                        {activeTab === 'skills' && (
                            <div className="space-y-16">
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_30px_cyan] mb-6">
                                        💫 Technical Expertise
                                    </h2>
                                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                        Mastering the tools that shape the future of web development
                                    </p>
                                </div>

                                {/* Skill Categories Filter */}
                                <div className="flex flex-wrap justify-center gap-4 mb-12">
                                    {skillCategories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => setActiveSkillCategory(category)}
                                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeSkillCategory === category
                                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                                                : 'bg-black/30 text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                                    {filteredSkills.map((skill, index) => (
                                        <div
                                            key={skill.name}
                                            className="group relative p-8 rounded-3xl border border-cyan-600/30 bg-gradient-to-br from-[#111111]/80 to-[#0a0a0a]/80 
                                                 shadow-lg shadow-cyan-700/20 hover:shadow-cyan-500/40 transition-all duration-500 hover:scale-105 backdrop-blur-sm"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 100}
                                        >
                                            <div className="text-center space-y-6">
                                                <div className="text-5xl mb-4">{skill.icon}</div>
                                                <h3 className="font-bold text-xl text-cyan-300 group-hover:text-white transition-colors">
                                                    {skill.name}
                                                </h3>
                                                <div className="text-sm text-gray-500 font-medium">
                                                    {skill.category}
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                                                            style={{ width: `${skill.level}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-base text-gray-400 font-medium">{skill.level}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* PROJECTS TAB */}
                        {activeTab === 'projects' && (
                            <div className="space-y-16">
                                <div className="text-center mb-16">
                                    <h2 className="text-4xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 drop-shadow-[0_0_30px_cyan] mb-6">
                                        🎨 Featured Projects
                                    </h2>
                                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                        Showcasing innovation through carefully crafted digital experiences
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
                                    {projects.map((project, index) => (
                                        <a
                                            key={project.title}
                                            href={project.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative p-10 rounded-3xl border border-cyan-600/30 bg-gradient-to-br from-[#111111]/60 to-[#0a0a0a]/60 
                                                 backdrop-blur-md shadow-xl shadow-cyan-700/20 hover:shadow-cyan-400/40 transition-all duration-500 
                                                 hover:scale-105 hover:border-cyan-400/50 flex flex-col justify-between min-h-[450px]"
                                            data-aos="fade-up"
                                            data-aos-delay={index * 150}
                                        >
                                            <div>
                                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${project.gradient} mb-8 flex items-center justify-center text-3xl shadow-lg`}>
                                                    {project.icon}
                                                </div>

                                                <h3 className="text-2xl lg:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-400 mb-6 group-hover:from-white group-hover:to-cyan-300 transition-all duration-300">
                                                    {project.title}
                                                </h3>

                                                <p className="text-gray-300 text-lg leading-relaxed mb-8 flex-grow">
                                                    {project.description}
                                                </p>

                                                <div className="flex flex-wrap gap-3 mb-8">
                                                    {project.tech.map((tech) => (
                                                        <span
                                                            key={tech}
                                                            className="px-4 py-2 text-sm rounded-full bg-gradient-to-r from-cyan-600/20 to-purple-600/20 
                                                                 border border-cyan-500/30 text-cyan-300 font-medium backdrop-blur-sm"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex items-center text-cyan-400 font-semibold text-lg group-hover:text-white transition-colors duration-300">
                                                <span>Explore Project</span>
                                                <svg className="w-6 h-6 ml-3 transform group-hover:translate-x-2 transition-transform duration-300"
                                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                </svg>
                                            </div>

                                            {/* Hover Effect Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                        </a>
                                    ))}
                                </div>

                                {/* View All Projects CTA */}
                                <div className="text-center mt-16" data-aos="fade-up">
                                    <div className="bg-gradient-to-r from-black/50 to-black/30 backdrop-blur-sm rounded-3xl border border-gray-800/50 p-12">
                                        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
                                            Want to See More?
                                        </h3>
                                        <p className="text-gray-300 text-lg mb-8">
                                            Check out my complete portfolio and ongoing projects on GitHub
                                        </p>
                                        <a
                                            href={`https://github.com/${username}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center space-x-3 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white font-semibold text-lg px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 border border-gray-600"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                            </svg>
                                            <span>View GitHub Profile</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Footer */}
                    <footer className="border-t border-gray-800/50 bg-black/50 backdrop-blur-sm mt-20">
                        <div className="max-w-6xl mx-auto px-6 py-16">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                <div className="space-y-6">
                                    <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                                        {name || 'Developer'}
                                    </h4>
                                    <p className="text-gray-400 leading-relaxed">
                                        Crafting digital experiences with passion, precision, and purpose.
                                        Let's build something extraordinary together.
                                    </p>
                                </div>

                                <div className="space-y-6">
                                    <h5 className="text-xl font-semibold text-white">Quick Links</h5>
                                    <nav className="space-y-3">
                                        {['home', 'about', 'skills', 'projects'].map((tab) => (
                                            <button
                                                key={tab}
                                                onClick={() => setActiveTab(tab)}
                                                className="block text-gray-400 hover:text-cyan-400 transition-colors capitalize"
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </nav>
                                </div>

                                <div className="space-y-6">
                                    <h5 className="text-xl font-semibold text-white">Connect</h5>
                                    <div className="flex space-x-4">
                                        <a href="#" className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-cyan-400 hover:text-white transition-colors border border-cyan-500/30">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                            </svg>
                                        </a>
                                        <a href="#" className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-cyan-400 hover:text-white transition-colors border border-cyan-500/30">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </a>
                                        <a href="#" className="w-12 h-12 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center text-cyan-400 hover:text-white transition-colors border border-cyan-500/30">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-800/50 mt-12 pt-8 text-center">
                                <p className="text-gray-400">
                                    © 2024 {name || 'Developer'}. Made with ❤️ and lots of ☕
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}