import { TeraboxXL } from './terabox-xl/package/dist/index.mjs';

const tb = new TeraboxXL({
  timeout: 20000,
  retries: 2,
  verbose: true,
});

async function main() {
  const url = 'https://1024tera.com/s/YqkqsmzOAEKYHHdPls9dfA';
  console.log('Resolving info for:', url);
  
  const info = await tb.getInfo(url);
  console.log('getInfo success:', info.success);
  if (!info.success) {
    console.error('Error code:', info.code, info.error);
    return;
  }
  console.log('Found files:', info.data?.list?.length);
  if (info.data?.list?.length) {
    console.log('File 0:', info.data.list[0]);
  }

  console.log('Fetching download links...');
  const links = await tb.getDownloadLinks(url);
  console.log('Download links result:', links);

  console.log('Fetching HLS info...');
  const hls = await tb.getHLSInfo(url);
  console.log('HLS result:', hls);
}

main().catch(console.error);
