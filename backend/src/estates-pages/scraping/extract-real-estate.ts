import { RealEstate } from 'src/real-estates/entities/real-estate.entity';
import * as puppeteer from 'puppeteer';

export class ExtractRealEstate {
  private readonly SELECTORS = {
    LISTING_LINK: 'a[data-ds-component="DS-NewAdCard-Link"]',
    PRICE: '.ad__sc-q5xder-1 > div:nth-child(1) > span:nth-child(1)',
    ADDRESS: '.olx-color-neutral-110',
    MAIN_ADDRESS: '.ad__sc-o5hdud-2 > div:nth-child(2) > span:nth-child(1)',
  };

  private readonly TIMEOUT = 4200;
  private readonly LESS_TIMEOUT = 1200;
  private readonly MIN_DELAY = 1000;
  private readonly MAX_DELAY = 3000;

  public async extractListingDetails(
    page: puppeteer.Page,
    link: string,
  ): Promise<Partial<RealEstate>> {
    try {
      await this.simulateHumanBehavior(page);

      const mainAddress = await this.getElementText(page, this.SELECTORS.MAIN_ADDRESS);
      const address = await this.getElementText(page, this.SELECTORS.ADDRESS);
      console.log('🚀 ~ file: app.service.ts:94 ~ address:', address);
      const zipCode = address.replace(/\D/g, '');
      const rentVal = await this.getElementText(page, this.SELECTORS.PRICE);
      const zipCodeFormated = zipCode.replace(/(\d{5})(\d{3})/, '$1-$2');
      return { zipCode: zipCodeFormated, rentVal, link, address: `${mainAddress}, ${address}` };
    } catch (err) {
      console.log('extractListingDetails ~ err:', err);
      return { zipCode: '', rentVal: '', link, address: '' };
    }
  }

  public async randomDelay(): Promise<void> {
    const delay = Math.floor(
      Math.random() * (this.MAX_DELAY - this.MIN_DELAY + 1) + this.MIN_DELAY,
    );
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private async simulateHumanBehavior(page: puppeteer.Page): Promise<void> {
    await page.evaluate(() => {
      const scrollHeight = Math.floor(Math.random() * 3100);
      window.scrollBy(0, scrollHeight);
    });
    await this.randomDelay();
    await this.scrollDown(page);
  }

  private async scrollDown(page: puppeteer.Page) {
    await page.evaluate(() => {
      window.scrollBy(0, 500);
    });
  }

  private async getElementText(page: puppeteer.Page, selector: string): Promise<string> {
    await page.waitForSelector(selector, { timeout: this.TIMEOUT });
    const innerText = await page.$eval(selector, el => el.textContent?.trim() || '');
    return innerText;
  }
}
