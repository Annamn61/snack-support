import './percent.scss'
interface SmallPercentBarProps {
    percent: number,
}

export const SmallPercentBar: React.FC<SmallPercentBarProps> = ({ percent }: SmallPercentBarProps) => {
    return (
        <div className="bar-small">
            <div className="active" style={{ width: `${Math.min(percent, 100)}%` }} />
        </div>
    );
};