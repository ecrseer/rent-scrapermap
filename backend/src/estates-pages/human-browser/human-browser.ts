import * as puppeteer from 'puppeteer';

export class HumanBrowser {
  browser: puppeteer.Browser;
  page: puppeteer.Page;
  sourceUrl = 'https://www.olx.com.br/imoveis/aluguel/estado-rj/rio-de-janeiro-e-regiao/zona-norte';

  public async build() {
    this.browser = await this.initializeBrowser();
    this.page = await this.browser.newPage();
    await this.setupPage(this.page);
    return this;
  }

  private async initializeBrowser(mode?: 'headless' | 'non-headless'): Promise<puppeteer.Browser> {
    if (mode === 'non-headless') {
      return puppeteer.launch({
        headless: false,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--window-size=1920,1080',
        ],
      });
    } else {
      return puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--window-size=1920,1080',
        ],
      });
    }
  }

  private async setupPage(page: puppeteer.Page): Promise<void> {
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );

    // Set additional headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    });

    await page.goto(this.sourceUrl, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
  }

  private async setupPage2Human() {
    const browser = await this.initializeBrowser();
    const newPage = await browser.newPage();
    await newPage.setViewport({ width: 1920, height: 1080 });
    await newPage.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );

    // Set cookies to appear more like a real browser
    await newPage.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive',
    });
    return browser;
  }
}
