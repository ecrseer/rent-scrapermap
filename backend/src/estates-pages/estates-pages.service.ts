import { Injectable } from '@nestjs/common';
import { CreateEstatesPageDto } from './dto/create-estates-page.dto';
import { UpdateEstatesPageDto } from './dto/update-estates-page.dto';
import { HumanBrowser } from './human-browser/human-browser';
import { ExtractRealEstate } from './scraping/extract-real-estate';
import { RealEstate } from 'src/real-estates/entities/real-estate.entity';
import * as puppeteer from 'puppeteer';
import { RealEstatesService } from 'src/real-estates/real-estates.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EstatesPage, StepStatus } from './entities/estates-page.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EstatesPagesService {
  constructor(
    private readonly realEstatesService: RealEstatesService,
    @InjectRepository(EstatesPage)
    private readonly estatesPageRepository: Repository<EstatesPage>,
  ) {}

  private readonly SELECTORS = {
    LISTING_LINK: 'a[data-ds-component="DS-NewAdCard-Link"]',
  };

  ondModuleInit() {
    this.startScraping();
  }

  async savePage(createEstatesPageDto: CreateEstatesPageDto) {
    return this.estatesPageRepository.save(createEstatesPageDto);
  }

  async findPendingPages() {
    return this.estatesPageRepository.find({
      where: {
        stepStatus: StepStatus.STARTED,
      },
    });
  }

  async startScraping() {
    const webb = {
      human: new HumanBrowser(),
    };
    try {
      webb.human = await new HumanBrowser().build();
      const page = webb.human.page;

      const links = await this.extractListingLinks(page);
      console.log('🚀 ~ file: estates-pages.service.ts:31 ~ links:', links);
      await webb.human.browser.close();

      this.savePage({
        sourceUrl: webb.human.sourceUrl,
        page: 1,
        links,
        stepStatus: StepStatus.STARTED,
      });

      // const listings = await this.processListings(links);
      // console.log('🚀 ~ file: app.service.ts:35 ~ listings:', listings);
      // return listings;
    } catch (error) {
      console.error('Error scraping listings:', error);
      return [];
    } finally {
      await webb.human.browser.close();
    }
  }

  private async extractListingLinks(page: puppeteer.Page) {
    const hrefs = await page.$$eval(this.SELECTORS.LISTING_LINK, el =>
      el.map(el => el.getAttribute('href')),
    );
    const links = new Set(hrefs);

    return [...links];
  }

  private async processListings(links: string[]) {
    const listings: Partial<RealEstate & { zipCodeFormated: string }>[] = [];

    const webb = {
      human: null,
    };
    const extractor = new ExtractRealEstate();
    try {
      for (const link of links.slice(0, 5)) {
        await extractor.randomDelay();
        webb.human = await new HumanBrowser().build();

        const newPage = webb.human.page;
        await newPage.goto(link, {
          waitUntil: 'networkidle2',
          timeout: 30000,
        });
        await extractor.randomDelay();

        const listing = await extractor.extractListingDetails(newPage, link);
        console.log('🚀 ~ file: app.service.ts:73 ~ listing:', listing);
        if (listing.zipCode) {
          listings.push(listing);

          await this.realEstatesService.saveHouse(listing);
        }

        await webb.human.browser.close();
      }
      return listings;
    } catch (err) {
      console.log('processListings ~ err:', err);
      await webb.human.browser.close();
    }

    return listings;
  }
}
