import Image from "next/image";

export default function CodeQuestsLogo() {
  return (
    <Image
      src="/code-quests-logo.png"
      alt="Code Quests"
      width={320}
      height={90}
      priority
      className="mb-6 h-auto w-[180px] md:w-[260px]"
    />
  );
}