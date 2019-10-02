(function($) {
    "use strict"; // Start of use strict
    // jQuery for page scrolling feature
    $('.page-scroll').on("click", function(e) {
        var $anchor = $(this).find('a');
        $("html, body").stop().animate({
            scrollTop: ($($anchor.attr("href")).offset().top)
        }, 1250, "easeInOutExpo");
        e.preventDefault();
    });

    $(".background-image-wrapper").each(function() {
        var image = $(this).children("img").attr("src");
        $(this).css("background", 'url("' + image + '")').css("background-position", "initial").css("opacity", "1");
    })

    // creating the skills section
    $("#skills .skill-bar").each(function() {
        var width = $(this).attr("data-width");
        $(this).addClass("skill-bar-" + width);
        $(this).css( "animation-name", "slideInLeft" );
        $(this).find('.skill-tip').text(width + '%');
    });
    $("#skill-dots .skill").each(function() {
        var score = $(this).find('.skill-progress').attr("data-score");
        var html = "";
        for (var i = 0; i < score; i++) {
            html += "<i class='fa active wow'></i>";
        }
        for (var i = score; i < 10; i++) {
            html += "<i class='fa wow'></i>";
        }
        $(this).find('.skill-progress').html(html);
    })

    // scrollspy is used to highlight the active menu
    $('body').scrollspy({
        target: '.nav-container',
        offset: 50
    });

    //Init WOW JS
    new WOW().init();

    //fixed top navigation on scroll
    $('#TopMenu').affix({
        offset: {
            top: 80
        }
    });

    // On load of total site ...  
    $(window).on("load", function(e) {
        // hide loader once site is loaded
        $(".loader-wrapper").fadeOut("slow");
        //play Youtube video
        $("#youtubeVideo").YTPlayer();
        //Pretty photo lightbox
        $("a[data-gal^='prettyPhoto']").prettyPhoto({
            hook: 'data-gal',
            social_tools: false,
            deeplinking: false,
            animation_speed: 'normal',
            theme: 'dark_square',
            slideshow: 3000,
            autoplay_slideshow: false
        });
        // Isotope Portfolio for index-02
        $container1.isotope({
            filter: '*',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            },
            masonry: {
                // gutter: 10,
                itemSelector: '.item',
                columnWidth: 0
            },
        });

        //Email Submission for index-2
        $("form[name='emailSubmission01']").validate({
            // Specify validation rules
            rules: {
                name: {
                    required: true,
                    minlength: 3,
                },
                email: {
                    required: true,
                    email: true
                },
                subject: "required",
                message: "required"
            },
            // Specify validation error messages
            messages: {
                name: "Please enter your Name",
                email: {
                    required: "Please enter your email address",
                    email: "Please enter a valid email address"
                },
                subject: "Please enter your subject",
                message: "Please enter your comments"
            },
            submitHandler: function(form) {
                //form.submit();
                var $form = $(form),
                    $messageSuccess = $('#successMessage'),
                    $messageError = $('#errorMessage'),
                    $submitButton = $(this.submitButton);
                $submitButton.button('loading');

                // Ajax Submit
                $.ajax({
                    type: 'POST',
                    url: $form.attr('action'),
                    data: {
                        name: $form.find('#name').val(),
                        email: $form.find('#email').val(),
                        subject: $form.find('#subject').val(),
                        message: $form.find('#message').val()
                    }
                }).always(function(data, textStatus, jqXHR) {
                    if (data.response == 'success') {
                        $messageSuccess.removeClass('hidden');
                        $messageError.addClass('hidden');
                        // Reset Form
                        $form.find('.minimal')
                            .val('')
                            .blur()
                            .parent()
                            .removeClass('has-success')
                            .removeClass('has-error')
                            .find('label.error')
                            .remove();
                        $submitButton.button('reset');
                        return;
                    }
                    $messageError.removeClass('hidden');
                    $messageSuccess.addClass('hidden');
                    $form.find('.has-success').removeClass('has-success');
                    $submitButton.button('reset');
                });
            }
        });

        // Grid Rotator
        $('#ri-grid').gridrotator({
            rows: 3,
            columns: 3,
            animType: 'fadeInOut',
            animSpeed: 1000,
            interval: 600,
            step: 1,
            w1024: {
                rows: 3,
                columns: 3
            },
            w768: {
                rows: 3,
                columns: 3
            },
            w600: {
                rows: 3,
                columns: 3
            },
            w480: {
                rows: 3,
                columns: 3
            },
            w320: {
                rows: 3,
                columns: 3
            },
            w240: {
                rows: 3,
                columns: 3
            }
        });

    })
    // init Isotope
    var $container1 = $('.isotope').isotope({
        itemSelector: '.element-item',
        layoutMode: 'masonry',
        getSortData: {
            name: '.name',
            symbol: '.symbol',
            number: '.number parseInt',
            category: '[data-category]',
            weight: function(itemElem) {
                var weight = $(itemElem).find('.weight').text();
                return parseFloat(weight.replace(/[\(\)]/g, ''));
            }
        }
    });

    // filter functions
    var filterFns = {
        // show if number is greater than 50
        numberGreaterThan50: function() {
            var number = $(this).find('.number').text();
            return parseInt(number, 10) > 50;
        },
        // show if name ends with -ium
        ium: function() {
            var name = $(this).find('.name').text();
            return name.match(/ium$/);
        }
    };

    // bind filter button click
    $('#filters').on('click', 'button', function() {
        var filterValue = $(this).attr('data-filter');
        // use filterFn if matches value
        filterValue = filterFns[filterValue] || filterValue;
        $container1.isotope({
            filter: filterValue
        });
    });

    // bind sort button click
    $('#sorts').on('click', 'button', function() {
        var sortByValue = $(this).attr('data-sort-by');
        $container1.isotope({
            sortBy: sortByValue
        });
    });

    // change is-checked class on buttons
    $('.button-group').each(function(i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on('click', 'button', function() {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
        });
    });

    //****************************
    // Isotope Load more button
    //****************************
    var initShow = 9; //number of items loaded on init & onclick load more button
    var counter = initShow; //counter for load more button
    var iso = $container1.data('isotope'); // get Isotope instance

    loadMore(initShow); //execute function onload

    function loadMore(toShow) {
        $container1.find(".hidden").removeClass("hidden");
        var hiddenElems = iso.filteredItems.slice(toShow, iso.filteredItems.length).map(function(item) {
            return item.element;
        });
        $(hiddenElems).addClass('hidden');
        $container1.isotope('layout');
        //when no more to load, hide show more button
        if (hiddenElems.length == 0) {
            jQuery("#load-more").hide();
        } else {
            jQuery("#load-more").show();
        };

    }

    //append load more button
    $container1.after('<div class="load-more"><button class="btn btn-transparent" id="load-more"> Load more</button></div>');

    //when load more button clicked
    $("#load-more").on('click', function() {
        if ($('#filters').data('clicked')) {
            //when filter button clicked, set initial value for counter
            counter = initShow;
            $('#filters').data('clicked', false);
        } else {
            counter = counter;
        };
        counter = counter + initShow;
        loadMore(counter);
    });

    //when filter button clicked
    $("#filters").on('click', function() {
        $(this).data('clicked', true);
        loadMore(initShow);
    });

    // For skill chart jquery
    $(document).ready(function(e) {
        //var windowBottom = $(window).height();
        var index = 0;
        $(document).scroll(function() {
            var top = $('.technical').height() - $(window).scrollTop();
            if (top < -300) {
                if (index == 0) {
                    $('.chart').easyPieChart({
                        easing: 'easeOutBounce',
                        onStep: function(from, to, percent) {
                            $(this.el).find('.percent').text(Math.round(percent));
                        }
                    });
                }
                index++;
            }
        })

    });

    // Testimonial Carousel 
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: true,
        smartSpeed: 1000,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })


})(jQuery);
