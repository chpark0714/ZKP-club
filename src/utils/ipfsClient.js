import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';

// window.Buffer 설정
window.Buffer = window.Buffer || Buffer;

const auth = 'Basic ' + Buffer.from(
  process.env.REACT_APP_INFURA_PROJECT_ID + ':' + 
  process.env.REACT_APP_INFURA_API_SECRET
).toString('base64');

const ipfsClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth
  }
});

export default ipfsClient; 