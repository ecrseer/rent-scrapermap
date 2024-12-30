import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { Listing } from './types/listing';
import { HumanBrowser } from './human-browser/human-browser';
import { zipsListings } from './logs/sample';
import { getZipToLatStrategy } from './zipcode-to-lat-lon/izipcode-to-lat-lon';

@Injectable()
export class AppService {
  private readonly SELECTORS = {
    LISTING_LINK: 'a[data-ds-component="DS-NewAdCard-Link"]',
    PRICE: '.ad__sc-q5xder-1 > div:nth-child(1) > span:nth-child(1)',
    ADDRESS: '.olx-color-neutral-110',
  };

  private readonly TIMEOUT = 4200;
  private readonly LESS_TIMEOUT = 1200;
  private readonly MIN_DELAY = 1000;
  private readonly MAX_DELAY = 3000;

  async onModuleInit() {
    const scraped = zipsListings;
    const strategy = getZipToLatStrategy();
    strategy.cepToLatLng(scraped[0].zipCode).then(res => {
      console.log('🚀 ~ file: app.service.ts:26 ~ onModuleInit ~ res:', res);
    });
  }

  async scrapeListings(): Promise<Listing[]> {
    const webb = {
      human: null,
    };
    try {
      webb.human = await new HumanBrowser().build();
      const page = webb.human.page;

      const links = await this.extractListingLinks(page);
      await webb.human.browser.close();
      const listings = await this.processListings(links);
      console.log('🚀 ~ file: app.service.ts:35 ~ listings:', listings);
      return listings;
    } catch (error) {
      console.error('Error scraping listings:', error);
      return [];
    } finally {
      await webb.human.browser.close();
    }
  }

  private async extractListingLinks(page: puppeteer.Page): Promise<string[]> {
    const hrefs = await page.$$eval(this.SELECTORS.LISTING_LINK, el =>
      el.map(el => el.getAttribute('href')),
    );
    const links = new Set(hrefs);

    return [...links];
  }

  private async processListings(links: string[]): Promise<Listing[]> {
    const listings: Listing[] = [];

    const webb = {
      human: null,
    };
    try {
      for (const link of links.reverse()) {
        await this.randomDelay();
        webb.human = await new HumanBrowser().build();

        const newPage = webb.human.page;
        await newPage.goto(link, {
          waitUntil: 'networkidle2',
          timeout: 30000,
        });
        await this.randomDelay();

        const listing = await this.extractListingDetails(newPage, link);
        console.log('🚀 ~ file: app.service.ts:73 ~ listing:', listing);
        if (listing.zipCode) {
          listings.push(listing);
        }

        await webb.human.browser.close();
      }
    } catch (err) {
      console.log('processListings ~ err:', err);
      await webb.human.browser.close();
    }

    return listings;
  }

  private async extractListingDetails(page: puppeteer.Page, link: string): Promise<any> {
    try {
      await this.randomDelay();
      await this.simulateHumanBehavior(page);

      const address = await this.getElementText(page, this.SELECTORS.ADDRESS);
      console.log('🚀 ~ file: app.service.ts:94 ~ address:', address);
      const zipCode = address.replace(/\D/g, '');
      const rentVal = await this.getElementText(page, this.SELECTORS.PRICE);
      return { zipCode, rentVal, link };
    } catch (err) {
      console.log('extractListingDetails ~ err:', err);
      return { zipCode: '', rentVal: '', link };
    }
  }

  private async randomDelay(): Promise<void> {
    const delay = Math.floor(
      Math.random() * (this.MAX_DELAY - this.MIN_DELAY + 1) + this.MIN_DELAY,
    );
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private async simulateHumanBehavior(page: puppeteer.Page): Promise<void> {
    // Random scroll
    await page.evaluate(() => {
      const scrollHeight = Math.floor(Math.random() * 100);
      window.scrollBy(0, scrollHeight);
    });
    await this.randomDelay();
    await this.scrollDown(page);
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
