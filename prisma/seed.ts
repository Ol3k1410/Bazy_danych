import { PrismaClient, Role, ReleaseType, Format, Condition, CopyStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Rozpoczynanie zasilania bazy danych (seed)...');

    // 1. Czyszczenie bazy (opcjonalnie w kolejności zależności)
    await prisma.rentalItem.deleteMany();
    await prisma.rental.deleteMany();
    await prisma.copy.deleteMany();
    await prisma.track.deleteMany();
    await prisma.releaseArtist.deleteMany();
    await prisma.releaseGenre.deleteMany();
    await prisma.release.deleteMany();
    await prisma.artist.deleteMany();
    await prisma.genre.deleteMany();
    await prisma.user.deleteMany();

    // 2. Użytkownicy testowi
    const passwordHash = await bcrypt.hash('Secret123!', 10);

    const admin = await prisma.user.create({
        data: {
            email: 'admin@wypozyczalnia.pl',
            passwordHash,
            firstName: 'Admin',
            lastName: 'Wypożyczalni',
            role: Role.ADMIN,
            phoneNumber: '+48111222333',
        },
    });

    const employee = await prisma.user.create({
        data: {
            email: 'pracownik@wypozyczalnia.pl',
            passwordHash,
            firstName: 'Jan',
            lastName: 'Kowalski',
            role: Role.EMPLOYEE,
            phoneNumber: '+48222333444',
        },
    });

    const client = await prisma.user.create({
        data: {
            email: 'klient@onet.pl',
            passwordHash,
            firstName: 'Piotr',
            lastName: 'Nowak',
            role: Role.CLIENT,
            phoneNumber: '+48555666777',
        },
    });

    // 3. Słownik gatunków
    const hipHop = await prisma.genre.create({ data: { name: 'Hip-Hop' } });
    const pop = await prisma.genre.create({ data: { name: 'Pop' } });
    const alt = await prisma.genre.create({ data: { name: 'Alternatywa' } });

    // 4. Artyści
    const taco = await prisma.artist.create({
        data: {
            name: 'Taco Hemingway',
            bio: 'Polski raper, autor tekstów, członek duetu TACONAFIDE oraz grupy club2020.',
        },
    });

    const quebo = await prisma.artist.create({
        data: {
            name: 'Quebonafide',
            bio: 'Polski raper, wokalista i założyciel wytwórni QueQuality.',
        },
    });

    const sanah = await prisma.artist.create({
        data: {
            name: 'sanah',
            bio: 'Polska piosenkarka, skrzypaczka i kompozytorka.',
        },
    });

    const dawid = await prisma.artist.create({
        data: {
            name: 'Dawid Podsiadło',
            bio: 'Polski wokalista i autor tekstów.',
        },
    });

    // 5. Wydania muzyczne (Albumy)
    // Album 1: Soma 0,5 mg (TACONAFIDE - duet, 2 wykonawców)
    const soma = await prisma.release.create({
        data: {
            title: 'Soma 0,5 mg',
            releaseType: ReleaseType.ALBUM,
            releaseYear: 2018,
            label: 'TACONAFIDE',
            artists: {
                create: [
                    { artistId: taco.id, role: 'MAIN' },
                    { artistId: quebo.id, role: 'MAIN' },
                ],
            },
            genres: {
                create: [{ genreId: hipHop.id }, { genreId: pop.id }],
            },
            tracks: {
                create: [
                    { title: 'Intro', trackNumber: 1, durationSeconds: 195 },
                    { title: 'Kryptowaluty', trackNumber: 2, durationSeconds: 214 },
                    { title: 'Art-B', trackNumber: 3, durationSeconds: 236 },
                    { title: 'Tamagotchi', trackNumber: 4, durationSeconds: 202 },
                ],
            },
        },
    });

    // Album 2: Uczta (sanah)
    const uczta = await prisma.release.create({
        data: {
            title: 'Uczta',
            releaseType: ReleaseType.ALBUM,
            releaseYear: 2022,
            label: 'Magic Records',
            artists: {
                create: [{ artistId: sanah.id, role: 'MAIN' }],
            },
            genres: {
                create: [{ genreId: pop.id }],
            },
            tracks: {
                create: [
                    { title: 'Szary świat', trackNumber: 1, durationSeconds: 220 },
                    { title: 'Sen we śnie', trackNumber: 2, durationSeconds: 185 },
                    { title: 'Ostatnia nadzieja', trackNumber: 3, durationSeconds: 230 },
                ],
            },
        },
    });

    // Album 3: Małomiasteczkowy (Dawid Podsiadło)
    const malomiasteczkowy = await prisma.release.create({
        data: {
            title: 'Małomiasteczkowy',
            releaseType: ReleaseType.ALBUM,
            releaseYear: 2018,
            label: 'Sony Music Entertainment Poland',
            artists: {
                create: [{ artistId: dawid.id, role: 'MAIN' }],
            },
            genres: {
                create: [{ genreId: pop.id }, { genreId: alt.id }],
            },
            tracks: {
                create: [
                    { title: 'Cantante', trackNumber: 1, durationSeconds: 190 },
                    { title: 'Małomiasteczkowy', trackNumber: 2, durationSeconds: 204 },
                    { title: 'Nie ma fal', trackNumber: 3, durationSeconds: 238 },
                ],
            },
        },
    });

    // 6. Fizyczne egzemplarze w wypożyczalni (Copies)
    await prisma.copy.createMany({
        data: [
            {
                releaseId: soma.id,
                barcode: '590123456701',
                format: Format.CD,
                condition: Condition.MINT,
                status: CopyStatus.AVAILABLE,
            },
            {
                releaseId: soma.id,
                barcode: '590123456702',
                format: Format.VINYL,
                condition: Condition.GOOD,
                status: CopyStatus.AVAILABLE,
            },
            {
                releaseId: uczta.id,
                barcode: '590123456703',
                format: Format.CD,
                condition: Condition.MINT,
                status: CopyStatus.AVAILABLE,
            },
            {
                releaseId: malomiasteczkowy.id,
                barcode: '590123456704',
                format: Format.VINYL,
                condition: Condition.GOOD,
                status: CopyStatus.AVAILABLE,
            },
        ],
    });

    console.log('Baza została pomyślnie zasilona danymi startowymi!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });