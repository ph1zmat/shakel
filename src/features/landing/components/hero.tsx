import { BeamMultiple } from './beam';
// Note: BeamMultiple is currently not used in the component

export const Hero = () => {
  return (
    <section className="grid grid-cols-2 items-center h-100">
      <div className="mx-auto px-6 text-center w-full h-60">
        <h1 className="text-4xl font-bold mb-4">
          Простое создание и гибкая автоматизация веб решений{' '}
          <span className=" text-accent">для обычных пользователей</span>
        </h1>
        <p className="text-lg mb-8">
          Создавайте мощные веб-приложения и автоматизируйте задачи без навыков
          программирования.
        </p>
        <div className="">
          <a
            href="#get-started"
            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300"
          >
            Начать сейчас
          </a>
          <a
            href="#pricing"
            className="text-white px-6 py-3 rounded-full hover:bg-blue-600 transition duration-300"
          >
            Изучить цены
          </a>
        </div>
      </div>
      <div className="flex justify-center items-center h-100">
        <div className="relative h-64 w-64">
          {/* <BeamMultiple /> */}

          <span
            className="absolute w-40 h-80 bg-gradient-to-br from-green-200/60 to-green-300/40
          backdrop-blur-xs
          shadow-lg top-60 left-15"
            style={{
              transform: 'rotate(-155deg) translateZ(40px)',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
          <span
            className="absolute w-40 h-80 bg-gradient-to-br from-blue-300/60 to-blue-400/40 
          backdrop-blur-xs
          shadow-lg top-0 left-10"
            style={{
              transform: 'rotate(25deg) translateZ(40px)',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        </div>
      </div>
    </section>
  );
};
