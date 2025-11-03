import { Page } from "../util/config";

// New "Coastal" button style
const buttonStyle = "font-bold bg-accent-blue text-white py-2 px-6 rounded-full transition duration-300 ease-in-out hover:scale-105 hover:bg-blue-800";

export default function Navbar(props) {

    const additionalClasses = "text-accent-blue font-bold";

    function setPage(property) {
        props.setPage(property);
    }

    function logout() {
        props.setUserInfo({ username: "", email: "" });
        props.setLoggedIn(false);
        setPage(Page.HOME_PAGE);
    }

    return (
        // A clean white navbar that "floats" over the beige background
        <div className="bg-card shadow-sm md:p-6 py-4 px-4 flex justify-between items-center max-w-7xl mx-auto">
            {/*logo and text*/}
            <div className="flex items-center cursor-pointer" onClick={() => window.location.reload()}>
                {/* Updated icon color to dark blue */}
                <img className="" width="24px" src="https://img.icons8.com/material-rounded/48/1E3A8A/cyber-security.png" alt="" />
                <p className="md:text-xl text-text-dark ml-2 font-['Space_Mono']">Graphical Password Auth</p>
            </div>

            {/*nav element list*/}
            <div className="font-sans text-text-light hidden md:flex items-center gap-8">
                <p className={`hover:text-accent-blue transition-colors text-lg cursor-pointer ${props.currentPage === Page.HOME_PAGE ? additionalClasses : ""}`} onClick={() => setPage(Page.HOME_PAGE)}>Home</p>
                {/* Contact link removed */}

                {!props.loggedIn && (
                    <div className="flex items-center gap-4 pl-8">
                        <button onClick={() => setPage(Page.LOGIN_PAGE)} className="text-lg font-bold text-text-dark hover:text-accent-yellow transition-colors">Login</button>
                        <button onClick={() => setPage(Page.SIGNUP_PAGE)} className={buttonStyle}>Sign Up</button>
                    </div>
                )}

                {props.loggedIn && (
                    <div className="flex items-center gap-6 pl-8">
                        <p className={`text-xl font-bold font-mono text-accent-blue`}>{props.userInfo.username}</p>
                        <button onClick={() => logout()} className={buttonStyle}>Logout</button>
                    </div>
                )}
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden">
                <img onClick={() => props.setSlider(true)} className="ml-2" width="32px" src="https://img.icons8.com/fluency-systems-regular/48/1E3A8A/menu--v1.png" alt="" />
            </div>
        </div>
    );
}

