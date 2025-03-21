import Image from 'next/image';
import { useState } from 'react';

export type FilmStory = {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  youtubeUrl: string;
  isNew?: boolean;
  isTeaser?: boolean;
  isEngagement?: boolean;
};

interface FilmCardProps {
  story: FilmStory;
  reversed?: boolean;
}

export default function FilmCard({ story, reversed = false }: FilmCardProps) {
  const { title, description, imageUrl, youtubeUrl } = story;
  const [showVideo, setShowVideo] = useState(false);
  
  // Extract names from title (assuming format like "NAME + NAME")
  const names = title.split('+').map(name => name.trim());
  const displayTitle = names.join(' + ');
  
  // Default image for films without an image URL
  const defaultImageUrl = '/images/placeholder-film.jpg';

  // Function to get YouTube embed URL from any YouTube URL format
  const getYouTubeEmbedUrl = (url: string) => {
    try {
      // Handle different YouTube URL formats
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      
      if (match && match[2].length === 11) {
        // Valid YouTube video ID
        // Add autoplay=1 and other parameters for better video experience
        return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0&modestbranding=1`;
      }
      
      // If no match found, return the original URL (assuming it's already an embed URL)
      return url;
    } catch (error) {
      console.error('Error parsing YouTube URL:', error);
      return url;
    }
  };

  const handleThumbnailClick = () => {
    setShowVideo(true);
  };

  // Function to handle the Watch Film button click
  const handleWatchFilm = () => {
    setShowVideo(true);
    // Find the iframe and request fullscreen
    setTimeout(() => {
      const iframe = document.querySelector(`iframe[title="${title} wedding film"]`) as HTMLIFrameElement;
      if (iframe) {
        if (iframe.requestFullscreen) {
          iframe.requestFullscreen();
        } else if ((iframe as HTMLIFrameElement & { webkitRequestFullscreen(): Promise<void> }).webkitRequestFullscreen) {
          (iframe as HTMLIFrameElement & { webkitRequestFullscreen(): Promise<void> }).webkitRequestFullscreen();
        } else if ((iframe as HTMLIFrameElement & { msRequestFullscreen(): Promise<void> }).msRequestFullscreen) {
          (iframe as HTMLIFrameElement & { msRequestFullscreen(): Promise<void> }).msRequestFullscreen();
        }
      }
    }, 100); // Small delay to ensure iframe is loaded
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 mb-0 items-center ${reversed ? 'md:grid-flow-dense' : ''}`}>
      <div className={reversed ? 'md:col-start-2' : ''}>
        <div className="relative aspect-video w-full overflow-hidden">
          {showVideo && youtubeUrl ? (
            <iframe
              src={getYouTubeEmbedUrl(youtubeUrl)}
              title={`${title} wedding film`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <div 
              onClick={handleThumbnailClick}
              className="relative w-full h-full cursor-pointer group overflow-hidden"
            >
              <Image 
                src={imageUrl || defaultImageUrl} 
                alt={`${title} wedding film`} 
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="px-16 py-12 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl md:text-3xl font-serif text-brand-blue mb-4">{displayTitle}</h2>
        <p className="text-gray-700 mb-6">{description}</p>
        <button 
          onClick={handleWatchFilm}
          className="inline-block px-8 py-2 border border-black text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-300"
        >
          Watch Film
        </button>
      </div>
    </div>
  );
} 