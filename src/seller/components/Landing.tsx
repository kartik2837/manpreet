
import {
  FaCheckCircle,
  FaStore,
  FaBoxOpen,
  FaUsers,
  FaChartLine,
  FaShippingFast,
  FaMoneyBillWave,
  FaBullhorn,
  FaTruck,
  FaBox
} from "react-icons/fa";

const Landing = () => {
  return (
    <div className="w-full">

      {/* HERO */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-20 bg-gradient-to-r from-orange-50 to-white">
        
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Sell Across India <br />
            with <span className="text-orange-500">Selfysnap</span>
          </h1>

          <p className="text-gray-600 text-lg">
            Join thousands of sellers growing their business online.
          </p>

          <ul className="text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500"/> Zero registration cost
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500"/> Fast payments
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500"/> Easy dashboard
            </li>
          </ul>

          <div className="space-x-4">
            <button className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600">
              Start Selling
            </button>
            <button className="border px-6 py-3 rounded-lg hover:bg-gray-100">
              Learn More
            </button>
          </div>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="/seller.jpeg"
            alt="seller"
            className="w-[90%] max-w-[900px] h-[600px] object-cover rounded-xl shadow-xl"
          />
        </div>
      </div>

      {/* RUNNING STRIP */}
      <div className="w-full overflow-hidden bg-orange-100 py-4">
        <div className="animate-marquee flex items-center gap-16">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-16">

              <div className="flex items-center gap-3 text-orange-600 text-lg font-semibold">
                <FaTruck className="text-3xl" />
                <FaBox />
                <span>Selfysnap Fast Delivery</span>
              </div>

              <div className="flex items-center gap-3 text-orange-600 text-lg font-semibold">
                <FaTruck className="text-3xl" />
                <FaBox />
                <span>All India Shipping</span>
              </div>

              <div className="flex items-center gap-3 text-orange-600 text-lg font-semibold">
                <FaTruck className="text-3xl" />
                <FaBox />
                <span>Secure Packaging</span>
              </div>

              <div className="flex items-center gap-3 text-orange-600 text-lg font-semibold">
                <FaTruck className="text-3xl" />
                <FaBox />
                <span>Selfysnap Express</span>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* WELCOME */}
      <div className="px-6 md:px-10 py-16 bg-gradient-to-r from-black to-gray-800 text-white flex flex-col md:flex-row items-center justify-between rounded-xl mx-6 md:mx-10 my-10">
        
        <div className="md:w-1/2 space-y-5">
          <h2 className="text-3xl md:text-4xl font-bold">
            Welcome to Selfysnap sellers 
          </h2>

          <p className="text-gray-300">
            Start your journey and unlock unlimited growth opportunities.
          </p>

          <ul className="text-gray-300 space-y-2">
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-orange-400"/> Easy onboarding
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-orange-400"/> Advanced dashboard
            </li>
            <li className="flex items-center gap-2">
              <FaCheckCircle className="text-orange-400"/> Secure payments
            </li>
          </ul>

          <button className="bg-orange-500 px-6 py-3 rounded-lg hover:bg-orange-600">
            Join Now
          </button>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            src="/manpreet.jpeg"
            alt="banner"
            className="w-[90%] max-w-[400px] h-[250px] object-cover rounded-xl shadow-2xl"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 md:px-10 py-12 bg-gray-50 text-center">
        <div className="flex flex-col items-center">
          <FaStore className="text-orange-500 text-3xl mb-2"/>
          <h2 className="text-2xl font-bold text-orange-500">10K+</h2>
          <p>Sellers</p>
        </div>

        <div className="flex flex-col items-center">
          <FaBoxOpen className="text-orange-500 text-3xl mb-2"/>
          <h2 className="text-2xl font-bold text-orange-500">5L+</h2>
          <p>Products</p>
        </div>

        <div className="flex flex-col items-center">
          <FaUsers className="text-orange-500 text-3xl mb-2"/>
          <h2 className="text-2xl font-bold text-orange-500">20k+</h2>
          <p>Customers</p>
        </div>

        <div className="flex flex-col items-center">
          <FaChartLine className="text-orange-500 text-3xl mb-2"/>
          <h2 className="text-2xl font-bold text-orange-500">99%</h2>
          <p>Success</p>
        </div>
      </div>

      {/* FEATURES */}
      <div className="py-16 px-6 md:px-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          Why Choose Selfysnap?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 shadow-lg rounded-xl hover:shadow-2xl transition">
            <FaMoneyBillWave className="text-orange-500 text-4xl mb-3 mx-auto"/>
            <h3 className="text-xl font-semibold mb-2">Low Commission</h3>
            <p className="text-gray-500">More profit for sellers</p>
          </div>

          <div className="p-6 shadow-lg rounded-xl hover:shadow-2xl transition">
            <FaShippingFast className="text-orange-500 text-4xl mb-3 mx-auto"/>
            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
            <p className="text-gray-500">Quick shipping network</p>
          </div>

          <div className="p-6 shadow-lg rounded-xl hover:shadow-2xl transition">
            <FaBullhorn className="text-orange-500 text-4xl mb-3 mx-auto"/>
            <h3 className="text-xl font-semibold mb-2">Marketing Tools</h3>
            <p className="text-gray-500">Boost your sales</p>
          </div>
        </div>
      </div>

      {/* 🚀 BIG CTA BANNER */}
      <div className="relative w-full h-[500px] md:h-[700px] mt-16">

        <img
          src="/shyam.jpeg"
          alt="banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 space-y-6">

          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Start Your Online Business Today 
          </h2>

          <p className="text-gray-300 max-w-xl">
            Join Selfysnap and reach customers across India with zero hassle.
          </p>

          <div className="flex gap-4">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600">
              Become Seller
            </button>

            <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-black transition">
              Contact Us
            </button>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Landing;
