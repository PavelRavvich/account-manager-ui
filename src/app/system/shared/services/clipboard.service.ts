export class ClipboardService {
    copyToClipboard(text : string) : void {
        document.addEventListener('copy', (e : ClipboardEvent) => {
            e.clipboardData.setData('text/plain', text);
            e.preventDefault();
        });
        document.execCommand('copy');
    }
}