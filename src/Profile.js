import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function Profile() {
  const { address } = useParams();

  return (
    <div>
      <h2>This is {address}'s Profile page!</h2>
      <h3>Ask him a question:</h3>
      <form>
        <div>
          <span>Question: </span>
          <label htmlFor='question'></label>
          <input id='question' type='text' />
        </div>
      </form>
    </div>
  );
}
