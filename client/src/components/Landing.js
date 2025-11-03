import { faUnlock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Page } from "../util/config"; // We need this to change page

// This is your new, minimal Home Page
export default function Home(props) { // Make sure to pass props from App.js

    function handleGetStarted() {
        props.setPage(Page.SIGNUP_PAGE);
    }

    return (
        <div className="font-sans">
            {/* Hero Section */}
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto py-24 sm:py-32 px-6">
                
                <h1 className="text-text-dark text-5xl sm:text-7xl font-black leading-tight">
                    A New Way to
                    {/* Using dark blue for the accent text */}
                    <span className="text-accent-blue"> Secure </span>
                    Your Account
                </h1>
                
                <p className="text-xl sm:text-2xl text-text-light mt-6 max-w-xl">
                    Ditch the hard-to-remember passwords. Use a secure, fun, and intuitive
                    graphical pattern to log in.
                </p>
                
                <button 
                    onClick={handleGetStarted} 
                    // Using the "mild yellow" as the main CTA for a playful pop
                    className="flex items-center gap-3 text-xl font-bold bg-accent-yellow text-text-dark py-4 px-10 rounded-full transition duration-300 ease-in-out hover:scale-105 hover:bg-yellow-300 mt-12"
                >
                    <FontAwesomeIcon icon={faUnlock} className="text-text-dark" />
                    Get Started Now
                </button>
            </div>
        </div>
    );
}

