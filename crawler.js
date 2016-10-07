/**
 * Created by lulu_lin on 2016-10-07.
 */
var http = require('http');
var cheerio = require('cheerio');
var url = 'http://www.imooc.com/learn/348';


function filterChapters(html) {
    var $ = cheerio.load(html);
    var charpters = $('.chapter');
    var courseData = [];

    charpters.each(function(item) {
        var chapter =  $(this);
        var chapterTmpTitle = chapter.find('strong').clone();
        chapterTmpTitle.find('div').remove();
        var chapterTitle = chapterTmpTitle.text().match(/\S+\s\S+/);
        var videos = chapter.find('.video').children('li');
        var chapterData = {
            chapterTitle: chapterTitle,
            videos: []
        };
        videos.each(function(item) {
            var video = $(this).find('.J-media-item');
            var videoTmpTitle = video.clone();
            videoTmpTitle.find('button').remove();
            var videoTitle = videoTmpTitle.text().match(/[0-9]+-[0-9]+\s\S*\s?\S*/);
            var id = video.attr('href').split('video/')[1];
            chapterData.videos.push({
                title : videoTitle,
                id: id
            });
        });
        courseData.push(chapterData);
    });
    return courseData;
}
function printCourseInfo(courseData) {
    courseData.forEach(function(item) {
        var chapterTitle = item.chapterTitle;
        console.log(chapterTitle + '\n');
        item.videos.forEach(function(video) {
            console.log(' 【' + video.id + ' 】' + video.title + '\n');
        });
    });
}

http.get(url,function(res) {
    var html = '';
    res.on('data',function(data) {
        html += data;
    });
    res.on('end',function() {
        var courseData = filterChapters(html);
        printCourseInfo(courseData);
    });
}).on('error',function() {
    console.log('获取课程数据出错')
});