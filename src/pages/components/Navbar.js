import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  AiFillCloseCircle,
  AiFillPlusCircle,
  AiOutlineShoppingCart,
  AiFillMinusCircle,
} from "react-icons/ai";
import { BsFillBagCheckFill } from "react-icons/bs";
import {
  MdAccountCircle,
  MdManageAccounts,
  MdShoppingCart,
} from "react-icons/md";
import { BiLogInCircle, BiLogOut } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import {RiHotelFill} from "react-icons/ri";
import { motion } from "framer-motion";

const Navbar = ({
  logout,
  user,
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
}) => {
  const router = useRouter();
  const [dropdown, setDropdown] = useState(false);
  const [mdropdown, msetDropdown] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [sidebarham, setSidebarham] = useState(false);
  useEffect(() => {
    Object.keys(cart).length !== 0 && setSidebar(true);
    let exempted = ["/checkout", "/order", "/orders", "/myaccount"];
    if (exempted.includes(router.pathname)) {
      setSidebar(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const ref = useRef();
  const toggleCart = () => {
    setSidebar(!sidebar);
    // if(ref.current.classList.contains("translate-x-full")){
    //   ref.current.classList.remove('translate-x-full')
    //   ref.current.classList.add("translate-x-0")
    // }
    // else if(!ref.current.classList.contains("translate-x-full")){
    //   ref.current.classList.remove('translate-x-0')
    //   ref.current.classList.add("translate-x-full")
    // }
  };
  const toggleCartham = () => {
    setSidebarham(!sidebarham);
  };
  return (
    <>
      {!sidebar && (
            <span
              onMouseOver={() => {
                setDropdown(true);
              }}
              onMouseLeave={() => {
                setDropdown(false);
              }}
            >
              {dropdown && user && (
                <div className="sticky top-0 z-30">
                <div className="absolute right-16 bg-white shadow-lg top-16 rounded-md px-5 w-44 py-4 z-30">
                  <span
                    onClick={() => {
                      setDropdown(false);
                    }}
                    className="absolute top-0 right-2 cursor-pointer text-2xl text-black"
                  >
                    <>
                      <AiFillCloseCircle />
                    </>
                  </span>
                  <Link href={"/myaccount"}>
                    <li className="py-1 text-base hover:text-pink-700 list-none font-bold flex">
                      <MdManageAccounts className="mt-1 mx-2" />
                      My Account
                    </li>
                  </Link>
                  <Link href={"/orders"}>
                    <li className="py-1 text-base hover:text-pink-700 list-none font-bold flex">
                      <MdShoppingCart className="mt-1 mx-2" />
                      My Bookings
                    </li>
                  </Link>
                  <li
                    onClick={logout}
                    className="py-1 text-base hover:text-pink-700 list-none font-bold flex"
                  >
                    <BiLogOut className="mt-1 mx-2" />
                    Logout
                  </li>
                </div>
                </div>
              )}
            </span>
          )}
          {!sidebar && (
            <span
              onMouseOver={() => {
                setDropdown(true);
              }}
              onMouseLeave={() => {
                setDropdown(false);
              }}
            >
              {dropdown && !user && (
                <div className="sticky top-0 z-30">
                <div className="absolute right-16 bg-white shadow-lg top-16 rounded-md px-5 w-36 py-4 z-30 ">
                  <span
                    onClick={() => {
                      setDropdown(false);
                    }}
                    className="absolute top-0 right-2 cursor-pointer text-2xl text-black"
                  >
                    <>
                      <AiFillCloseCircle />
                    </>
                  </span>
                  <Link href={"/login"}>
                    <li className="py-1 hover:text-pink-700 list-none font-bold flex text-base">
                      <BiLogInCircle className="mx-2 mt-1" />
                      Login
                    </li>
                  </Link>
                </div>
                </div>
              )}
            </span>
          )}
      <div
        className={` Navbar flex flex-col lg:flex-row  justify-start md:justify-start items-center py-2 shadow-md bg-gray-900  dark:bg-black dark:text-white text-black sticky top-12 z-10 dark:sticky dark:top:0 ${!sidebarham?"h-20":""} w-full ${
          !sidebar && "overflow-hidden"
        }`}
      >
        <div className="lg:hidden mx-4 absolute right-0 top-8">
          <div className="space-y-2" onClick={toggleCartham}>
            <span
              className={`block w-8 h-0.5 bg-amber-500 ${
                sidebarham
                  ? "rotate-45 translate-y-3 absolute top-1"
                  : ""
              }`}
            ></span>
            <span
              className={`block w-8 h-0.5 bg-white ${sidebarham? "-rotate-45 translate-y-3 absolute bottom-1" : ""}`}
            ></span>
            <span className={`block w-8 h-0.5 bg-amber-500 ${
                sidebarham
                  ? "opacity-0"
                  : ""
              } `}></span>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center xl:flex-row">
          <Link href={"/"}>
            <div className="logo ml-auto flex flex-col md:justify-center justify-center items-center">
              <Image
                alt="logo"
                src="/cresentlogo.png"
                width={150}
                height={60}
              />
            </div>
          </Link>
        </div>
        <div className="nav right hidden lg:flex bg-gray-900">
          <motion.ul className="flex justify-center mx-4 items-center overflow-hidden whitespace-nowrap space-x-4 "
          initial={{ opacity: 0, y: -50 }}  transition={{ duration: 1 }}
          whileInView={{ opacity: 1, y: 0 }}
          >
            <hr className="h-2 w-full" />
            <Link href={"/"}>
              {" "}
              <li className="text-lg my-2 font-semibold hover:bg-gray-800 hover:rounded transition duration-150 ease-out hover:ease-in text-white ">
                Home
              </li>
            </Link>
            <Link href={"/booking"}>
              {" "}
              <li className="text-lg my-2 font-semibold hover:bg-gray-800 hover:rounded transition duration-150 ease-out hover:ease-in text-white ">
                Booking
              </li>
            </Link>
            <Link href={"/rooms"}>
              {" "}
              <li className="text-lg my-2 font-semibold hover:bg-gray-800 hover:rounded transition duration-150 ease-out hover:ease-in text-white ">
                Rooms
              </li>
            </Link>
            <Link href={"/gallery"}>
              {" "}
              <li className="text-lg my-2 font-semibold  hover:bg-gray-800 hover:rounded transition duration-150 ease-out hover:ease-in text-white">
                Gallery
              </li>
            </Link>
            <Link href={"/about"}>
              {" "}
              <li className="text-lg my-2 font-semibold  hover:bg-gray-800 hover:rounded transition duration-150 ease-out hover:ease-in text-white">
                About
              </li>
            </Link>
            <Link href={"/contactus"}>
              {" "}
              <li className="text-lg my-2 font-semibold  hover:bg-gray-800 hover:rounded transition duration-150 ease-out hover:ease-in text-white">
               Contact Us
              </li>
            </Link>
            {/* <Link href={"/"}> <a><li>Tshirts</li></a></Link> */}
          </motion.ul>
        </div>

        {/* <AiOutlineShoppingCart className="text-3xl md:text-xl"/> */}
        <motion.div className="cart absolute right-4 top-6 mx-5 flex justify-center"
        initial={{ opacity: 0, y: -50 }}  transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        >
          <Link href={"/rooms"}><motion.button className=" px-2 py-1 font-semibold bg-white rounded hover:bg-amber-600 hidden lg:block  bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-transparent bg-clip-text border-2 border-gray-200"
           whileHover={{scale:1.1}} whileTap={{scale:0.9}}
          >BOOK A STAY</motion.button></Link>
            <MdAccountCircle
              onMouseOver={() => {
                setDropdown(true);
              }}
              className="text-xl md:text-3xl cursor-pointer mx-4 text-white hidden lg:block"
            />
          <motion.div className="hidden lg:block"
          whileHover={{scale:1.1}} whileTap={{scale:0.9}}
          >
            <AiOutlineShoppingCart
              className="text-xl md:text-3xl cursor-pointer text-white"
              
              onClick={toggleCart}
            />

            <span className="absolute -top-2 -right-2 h-5 w-5 text-sm rounded-full bg-amber-500 text-white flex justify-center items-center items cursor-pointer">
              <span>{Object.keys(cart).length}</span>
            </span>
          </motion.div>
        </motion.div>
        <div
          ref={ref}
          className={`w-80 h-[100vh] sideCart overflow-y-scroll absolute top-0 text-white  px-8 py-10 transition-all bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-purple-900 to-slate-900 ${
            sidebar ? "right-0" : "-right-96"
          }`}
        >
          <h2 className="font-bold text-xl text-center">Shopping Cart</h2>
          <span
            onClick={toggleCart}
            className="absolute top-5 right-2 cursor-pointer text-2xl text-amber-500"
          >
            <>
              <AiFillCloseCircle />
            </>
          </span>
          <ol className="list-decimal">
            {Object.keys(cart).length == 0 && (
              <div className="my-4 font-semibold">Your Cart is Empty!</div>
            )}
            {Object.keys(cart).map((k) => {
              return (
                <li key={k}>
                  <div className="item flex flex-wrap my-5">
                    <img
                      src={cart[k].img1}
                      className="mx-4 mt-2 w-10 h-10 border-2 border-pink-300 rounded object-cover"
                    />
                    <div className="w-2/3 font-semibold">{`${cart[k].name} (${cart[k].category}) `}</div>
                    <div className="flex items-center justify-center w-1/3 font-semibold text-xl">
                      <>
                        <AiFillMinusCircle
                          onClick={() => {
                            removeFromCart(
                              k,
                              1,
                              cart[k].price,
                              cart[k].name,
                              cart[k].size,
                              cart[k].variant
                            );
                          }}
                          className="cursor-pointer text-amber-500"
                        />
                      </>
                      <span className="mx-3 text-sm">{cart[k].qty}</span>
                      <>
                        <AiFillPlusCircle
                          onClick={() => {
                            addToCart(
                              k,
                              1,
                              cart[k].price,
                              cart[k].name,
                              cart[k].size,
                              cart[k].variant
                            );
                          }}
                          className="cursor-pointer text-amber-500"
                        />
                      </>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <div className="font-bold my-2">SubTotal : ₹{subTotal}</div>
          <div className="flex">
            <Link href={"/checkout"}>
              <button
                disabled={Object.keys(cart).length == 0}
                className="disabled:bg-purple-400 flex mx-auto mr-2 text-white bg-purple-600 border-0 py-2 px-2 focus:outline-none hover:bg-amber-600 rounded text-sm"
              >
                <>
                  {" "}
                  <BsFillBagCheckFill className="m-1" />{" "}
                </>
                Checkout
              </button>
            </Link>
            <button
              disabled={Object.keys(cart).length == 0}
              onClick={clearCart}
              className="disabled:bg-yellow-300 flex mx-auto mr-2 text-white bg-yellow-600 border-0 py-2 px-2 focus:outline-none hover:bg-amber-600 rounded text-sm"
            >
              Clear cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
