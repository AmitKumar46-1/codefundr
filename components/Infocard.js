export default function Infocard({ icon, title, description }) {
  return (
    <div className="bg-[#12121a] rounded-2xl p-8 shadow-[0_0_30px_rgba(0,255,255,0.25)] hover:shadow-[0_0_50px_rgba(0,255,255,0.6)] transition-shadow duration-500 cursor-default select-text">
      <div className="text-6xl mb-4 drop-shadow-[0_0_30px_rgb(0,255,255)]">{icon}</div>
      <h3 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
        {title}
      </h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}
