import { nanoid } from 'nanoid';
import { commons } from '../static/message.js';
import { shuffleArray, unsplash } from '../util/util.js';

const search = async (req, res, next) => {
    const { keyword } = req.query;
    const images = [];

    if (typeof keyword === 'undefined') {
        return res.status(400).json({
            message: commons.invalid_params,
            format: "keyword"
        });
    }

    try {
        // Fetch images from Unsplash (3 pages of results)
        for (let i = 0; i < 3; i++) {
            const result = await unsplash.search.getPhotos({
                query: keyword,
                perPage: 30,
                orientation: 'landscape'
            });

            const resultsArray = result.response.results || [];
            resultsArray.forEach(each => {
                images.push({
                    id: nanoid(),
                    url: each.urls.small
                });
            });
        }

        // Shuffle the images to ensure randomness
        shuffleArray(images);

        // Select the first 16 shuffled images
        const selectedImages = images.slice(0, 16);

        // Send the single array of 16 images as the response
        res.status(200).json(selectedImages);
    } catch (error) {
        console.error("Image search error:", error);
        res.status(500).json({
            message: "Failed to fetch images. Please try again later."
        });
    }
};

export { search };
