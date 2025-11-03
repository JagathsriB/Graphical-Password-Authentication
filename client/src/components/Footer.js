import { Page } from "../util/config";

// No more form logic!
export default function Footer(props) {

    return (
        // NEW STYLE: Clean white background with a subtle top border
        <div className="bg-card border-t-2 border-gray-200 mt-24">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center py-8 px-6 gap-4">

                <div className="flex items-center">
                    {/* NEW STYLE: Updated icon color to dark blue */}
                    <img className="" width="24px" src="https://img.icons8.com/material-rounded/48/1E3A8A/cyber-security.png" alt="" />
                    {/* NEW STYLE: Updated text color for light background */}
                    <p className="sm:text-lg text-text-dark ml-2 font-['Space_Mono']">Graphical Password Auth</p>
                </div>

                <div>
                    {/* NEW STYLE: Updated text color and playful yellow hover */}
                    <p className="text-text-light sm:text-md text-sm text-center">
                        <a href="https://github.com/prathamesh-a" target="_blank" rel="noopener noreferrer" className="hover:text-accent-yellow transition-colors">
                            github.com/prathamesh-a
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

