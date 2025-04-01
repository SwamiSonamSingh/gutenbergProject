import React, { useEffect, useState } from 'react';
import { backButton as BackButton, searchIcon as SearchIcon, crossIcon as CrossIcon } from '../../common/icons';
import './books.scss';
import '../../common/fonts.scss';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Books = (props) => {
    const [result, setResult] = useState([]);
    const [finalResult, setFinalResult] = useState([]);
    const [page, setPage] = useState(2)
    const [isFocused, setIsFocused] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [nextPage, setNextPage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { category, categoryName, setComponent } = props;
    let debounceTimeout;

    // Fetch data with optional search query
    const fetchData = async (searchQuery = '', nextUrl = null, isLoadMore = false) => {
        if (isLoading) return; // Prevent duplicate calls
        setIsLoading(true);

        try {
            const url = nextUrl || (searchQuery
                ? `http://skunkworks.ignitesol.com:8000/books/?topic=${category}&search=${encodeURIComponent(searchQuery)}`
                : `http://skunkworks.ignitesol.com:8000/books/?topic=${category}`);

            const response = await fetch(url);
            const resultData = await response.json();

            if (isLoadMore) {
                setResult((prev) => [...prev, ...resultData.results]);
                setFinalResult((prev) => [...prev, ...resultData.results]);
            } else {
                setResult(resultData.results);
                setFinalResult(resultData.results);
            }
            setPage((prev) => prev + 1)
            setNextPage(`http://skunkworks.ignitesol.com:8000/books/?page=${page}&topic=fiction`);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial Fetch
    useEffect(() => {
        fetchData();
    }, [category]);

    // Handle Search with Debounce
    const handleSearch = (searchQuery) => {
        setSearchKey(searchQuery);
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            fetchData(searchQuery);
        }, 300);
    };

    // Infinite Scroll Handler
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 100 &&
                nextPage &&
                !isLoading
            ) {
                fetchData(searchKey, nextPage, true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [nextPage, isLoading, searchKey]);

    // handling click on each book
    const handleBookClick = (formats) => {
        const preferredFormats = ['text/html', 'application/pdf', 'text/plain'];
        const selectedFormat = preferredFormats.find(format => formats[format] && !formats[format].endsWith('.zip'));

        if (selectedFormat) {
            window.open(formats[selectedFormat], '_blank');
        } else {
            alert('No viewable version available');
        }
    };

    return (
        <div className='books'>
            <div className='books__heading'>
                <span onClick={() => setComponent('')} style={{ cursor: 'pointer' }}>
                    <BackButton />
                </span>
                {categoryName}
            </div>

            {/* Search Input */}
            <div className={isFocused ? 'books__inputBox__focused' : 'books__inputBox'}>
                <SearchIcon />
                <input
                    placeholder='Search'
                    type='text'
                    className='books__inputBox__input'
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    value={searchKey}
                    onChange={(event) => handleSearch(event.target.value)}
                />
                {searchKey && <span onClick={() => { setSearchKey(''); fetchData(); }}><CrossIcon /></span>}
            </div>

            {/* Book Results */}
            <div className='books__mainSection'>
                {result.length === 0 ? (
                    <div className='books__mainSection__loading'>Data Loading ...</div>
                ) : (
                    finalResult.map((books, index) => {
                        const imageUrl = books.formats?.['image/jpeg'];
                        return (
                            <div key={index} className='books__mainSection__items' onClick={() => handleBookClick(books.formats)}>
                                {imageUrl && <img src={imageUrl} alt={books.title} className='books__mainSection__items__image' />}
                                <h4 className='books__mainSection__items__title'>{books.title}</h4>
                                <h4 className='books__mainSection__items__author'>{books.authors[0]?.name || 'Unknown Author'}</h4>
                            </div>
                        );
                    })
                )}
            </div>
            <div className='books__loader'>
                {isLoading && <Box sx={{ display: 'flex' }}>
                    <CircularProgress />
                </Box>}
            </div>
        </div>
    );
};

export default Books;
