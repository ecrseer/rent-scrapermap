import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Listing } from './types/listing';

@Injectable()
export class AppService {
  private readonly SELECTORS = {
    LISTING_LINK: 'a[data-ds-component="DS-NewAdCard-Link"]',
    PRICE: '.ad__sc-q5xder-1 > div:nth-child(1) > span:nth-child(1)',
    ADDRESS: '.olx-color-neutral-110',
  };

  private readonly TIMEOUT = 4200;
  private readonly LESS_TIMEOUT = 1200;

  onModuleInit() {
    this.scrapeListings();
  }

  async scrapeListings(): Promise<Listing[]> {
    const browser = await this.initializeBrowser();
    try {
      const page = await browser.newPage();
      await this.setupPage(page);

      const links = await this.extractListingLinks(page);
      const listings = await this.processListings(page, links);

      return listings;
    } catch (error) {
      console.error('Error scraping listings:', error);
      return [];
    } finally {
      await browser.close();
    }
  }

  private async initializeBrowser(): Promise<puppeteer.Browser> {
    return puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  }

  private async setupPage(page: puppeteer.Page): Promise<void> {
    await page.setViewport({ width: 1366, height: 768 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    );
    await page.goto(
      'https://www.olx.com.br/imoveis/aluguel/estado-rj/rio-de-janeiro-e-regiao/zona-norte',
      {
        waitUntil: 'networkidle0',
      },
    );
    await page.waitForSelector(this.SELECTORS.LISTING_LINK, { timeout: this.TIMEOUT });
  }

  private async extractListingLinks(page: puppeteer.Page): Promise<string[]> {
    return page.evaluate(selector => {
      const items = document.querySelectorAll(selector);
      return Array.from(items)
        .map(item => item.getAttribute('href'))
        .filter((href): href is string => href !== null);
    }, this.SELECTORS.LISTING_LINK);
  }

  private async processListings(page: puppeteer.Page, links: string[]): Promise<Listing[]> {
    const listings: Listing[] = [];

    for (const link of links.slice(0,2)) {
      try {
        const listing = await this.extractListingDetails(page, link);
        console.log('🚀 ~ file: app.service.ts:68 ~ listing:', listing);
        if (listing.zipCode) {
          listings.push(listing);
        }
      } catch (error) {
        console.error(`Error processing listing ${link}:`, error);
      }
    }

    console.log("🚀 ~ file: app.service.ts:84 ~ listings:", listings)
    return listings;
  }

  private async extractListingDetails(page: puppeteer.Page, link: string): Promise<any> {
    await page.goto(link, { waitUntil: 'networkidle0' });
    await this.scrollDown(page);

    let rentVal = 'None';
    try {
      const address = await this.getElementText(page, this.SELECTORS.ADDRESS);
      console.log("🚀 ~ file: app.service.ts:94 ~ address:", address)
      const zipCode = address.replace(/\D/g, '');
      rentVal = await this.getElementText(page, this.SELECTORS.PRICE);
      return { zipCode, rentVal, link };
    } catch (err){
      console.log("tractListingDetails ~ err:", err)
    }
  }

  private async scrollDown(page: puppeteer.Page) {
    await page.evaluate(() => {
      window.scrollBy(0, 500); // Scroll down 500 pixels
    });
  }

  private async getElementText(page: puppeteer.Page, selector: string): Promise<string> {
    await page.waitForSelector(selector, { timeout: this.TIMEOUT });
    const innerText = await page.$eval(selector, el => el.textContent?.trim() || '');
    return innerText;
  }

  private mapZipCode({ selectors }) {
    // const price = document.querySelector(selectors.PRICE)?.textContent?.trim() || '';
    const addressEl = document.querySelector(selectors.ADDRESS);
    const addressText = addressEl?.textContent || '';
    // console.log("🚀 ~ file: app.service.ts:91 ~ zipCode:", zipCode)
    // const title = document.title || '';

    return {
      addressEl,
      addressText,
      link: window.location.href,
    };
  }
}
