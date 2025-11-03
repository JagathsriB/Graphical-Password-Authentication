import { Page } from "../util/config";
import { motion } from "framer-motion";

export default function Slider(props) {

    const additionalClasses = "text-accent-blue font-bold";

    function closeSlider() {
        props.setSlider(false);
    }

    function setPage(page) {
        props.setPage(page);
        closeSlider();
    }

    function logout() {
        props.setUserInfo({ username: "", email: "" });
        props.setLoggedIn(false);
        setPage(Page.HOME_PAGE);
    }

    return (
        <div className="md:hidden flex justify-center fixed w-full h-full overflow-hidden z-50">
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.3 }} onClick={closeSlider} className="right-0 w-1/3 bg-black"></motion.div>
            
            {/* Menu: Uses the white 'card' background */}
            <motion.div initial={{ x: 200 }} animate={{ x: 0 }} transition={{ duration: 0.4, type: "tween" }} className="bg-card h-full w-2/3">

                <div className="flex justify-end pr-3 pt-2">
                    {/* Dark blue close icon */}
                    <img onClick={closeSlider} alt="" width="32px" src="https://img.icons8.com/fluency-systems-filled/48/1E3A8A/multiply.png" />
                </div>

                {/* Main Menu Links */}
                <div className="text-2xl mt-12 flex flex-col font-sans text-text-light items-center gap-8">
                    <p onClick={() => setPage(Page.HOME_PAGE)} className={`cursor-pointer ${props.currentPage === Page.HOME_PAGE ? additionalClasses : ""}`}>Home</p>
                    {/* Contact Link Removed */}
                </div>

                {!props.loggedIn && (
                    <div className="flex justify-around mt-12 flex-col items-center text-white gap-6">
                        <button onClick={() => setPage(Page.LOGIN_PAGE)} className="font-bold text-xl text-text-dark transition duration-500 ease-in-out">Login</button>
                        <button onClick={() => setPage(Page.SIGNUP_PAGE)} className="font-bold bg-accent-blue text-white py-2 px-8 rounded-full transition duration-300 ease-in-out hover:scale-105">Sign Up</button>
                    </div>
                )}

                {props.loggedIn && (
                    <div className="flex items-center flex-col text-white mt-12 gap-6">
                        <p className={`text-2xl font-mono text-accent-blue`}>{props.userInfo.username}</p>
                        <button onClick={() => logout()} className="font-bold bg-accent-blue text-white py-2 px-8 rounded-full transition duration-300 ease-in-out hover:scale-105">Logout</button>
                    </div>
                )}

            </motion.div>
        </div>
    )
}

