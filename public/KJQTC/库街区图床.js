const TOKEN = ' ';

const OUTPUT_FILE = "../js/TK2.js";
const DEFAULT_CATEGORY = "YS";
const IMAGE_DIR = './img/';
const UPLOAD_INTERVAL = 1000; 

const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size').default;
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const FormData = require('form-data');

class KurobbsImageUploader {
    constructor(token) {
        this.token = token;
        this.uploadUrl = 'https://api.kurobbs.com/forum/uploadForumImgForH5';
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36',
            'source': 'h5',
            'Referer': 'http://www.kurobbs.com/',
            'Token': this.token
        };
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getBuffer(file) {
        if (Buffer.isBuffer(file)) {
            return file;
        }
        if (typeof file === 'string' && fs.existsSync(file)) {
            return fs.promises.readFile(file);
        }
        throw new Error('无效的文件格式，需提供文件路径或Buffer');
    }

    async imageToUrl(file, type = 'png') {
        try {
            const buffer = await this.getBuffer(file);
            
            const formData = new FormData();
            const fileName = typeof file === 'string' 
                ? path.basename(file) 
                : `image.${type}`;
            
            formData.append('files', buffer, {
                filename: fileName,
                contentType: `image/${type}`
            });

            const requestHeaders = {
                ...this.headers,
                ...formData.getHeaders()
            };

            const response = await fetch(this.uploadUrl, {
                method: 'POST',
                body: formData,
                headers: requestHeaders
            });

            const res = await response.json();
            
            if (!res.data || !res.data[0]) {
                throw new Error(`上传失败: ${res.msg || '未返回图片URL'}`);
            }

            const dimensions = sizeOf(buffer);
            const { width, height } = dimensions;
            
            return {
                url: res.data[0],
                width,
                height,
                filename: typeof file === 'string' ? path.basename(file) : `image.${type}`
            };
        } catch (error) {
            console.error('图片上传失败:', error.message);
            throw error;
        }
    }

    async batchUpload(dir) {
        if (!fs.existsSync(dir)) {
            throw new Error(`目录不存在: ${dir}`);
        }

        const files = fs.readdirSync(dir).filter(file => {
            const ext = path.extname(file).toLowerCase().slice(1);
            return ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext);
        });

        if (files.length === 0) {
            console.log(`目录${dir}中未找到图片文件`);
            return { results: [], totalFiles: 0 };
        }

        const uploadStartTime = Date.now();
        const results = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const filePath = path.join(dir, file);
            const ext = path.extname(file).toLowerCase().slice(1);

            if (i > 0 && UPLOAD_INTERVAL > 0) {
                console.log(`等待${UPLOAD_INTERVAL}毫秒后上传下一张...`);
                await this.delay(UPLOAD_INTERVAL);
            }

            try {
                const result = await this.imageToUrl(filePath, ext);
                results.push(result);
                console.log(`[${i + 1}/${files.length}] 上传成功: ${file} -> ${result.url}`);
            } catch (error) {
                console.log(`[${i + 1}/${files.length}] 上传失败: ${file} -> ${error.message}`);
                if (UPLOAD_INTERVAL > 0) {
                    await this.delay(UPLOAD_INTERVAL);
                }
            }
        }

        const totalUploadTimeMs = Date.now() - uploadStartTime;
        const totalUploadTime = (totalUploadTimeMs / 1000).toFixed(1);

        return {
            results: results,
            totalFiles: files.length,
            totalTime: totalUploadTime,
            totalTimeMs: totalUploadTimeMs
        };
    }

    async generateTKFile(uploadResults, category = DEFAULT_CATEGORY, outputPath = OUTPUT_FILE) {
        try {
            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            let fileContent = 'window.galleryImages = [\n';

            uploadResults.forEach((result, index) => {
                let title = `原神美图${index + 1}`;

                fileContent += '    {\n';
                fileContent += `        title: "${title}",\n`;
                fileContent += `        url: "${result.url}",\n`;
                fileContent += `        category: "${category}"\n`;
                fileContent += index === uploadResults.length - 1 ? '    }\n' : '    },\n';
            });

            fileContent += '];';

            await fs.promises.writeFile(outputPath, fileContent);
            console.log(`成功生成${outputPath}文件，共${uploadResults.length}条记录`);
        } catch (error) {
            console.error('生成文件失败:', error.message);
            throw error;
        }
    }
}

(async () => {
    const uploader = new KurobbsImageUploader(TOKEN);
    
    try {
        console.log(`开始批量上传，图片目录：${IMAGE_DIR}，上传间隔：${UPLOAD_INTERVAL}毫秒`);
        const uploadData = await uploader.batchUpload(IMAGE_DIR);
        const { results: batchResult, totalFiles, totalTime } = uploadData;

        console.log(`\n=== 批量上传总结 ===`);
        console.log(`待上传图片总数：${totalFiles}张`);
        console.log(`成功上传图片数：${batchResult.length}张`);
        console.log(`上传失败图片数：${totalFiles - batchResult.length}张`);
        console.log(`批量上传总用时：${totalTime}秒`);
        
        if (batchResult.length > 0) {
            await uploader.generateTKFile(batchResult);
        } else {
            console.log('没有成功上传的图片，不生成文件');
        }
    } catch (error) {
        console.error('批量上传失败:', error.message);
    }
})();
