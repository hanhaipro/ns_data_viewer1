import classNames from 'classnames';
import './styles.scss';

export const Loading = ({ loading, transparent }) => {
  if (loading === false) return <></>;

  return (
    <div
      className={classNames('absolute inset-0 flex justify-center items-center bg-white z-[1000]', {
        'opacity-50': transparent !== false,
      })}
    >
      <div className="spinner" />
    </div>
  );
};
