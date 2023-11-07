import noResults from '../../../assets/OhNuts.png';

export const NoResults: React.FC = () => {
    return (
        <div className="no-results">
           <img src={noResults} alt="Oh Nuts"/>
           <p>We couldn't find what you were looking for. Try another search.</p>
        </div>
    );
};