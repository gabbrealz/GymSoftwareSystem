FROM php:8.2-apache

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN docker-php-ext-install pdo pdo_pgsql && \
    rm -rf /var/lib/apt/lists/* && a2enmod rewrite && \
    sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf && \
    echo "log_errors = On" >> /usr/local/etc/php/conf.d/docker-php-logs.ini && \
    echo "error_log = /proc/self/fd/2" >> /usr/local/etc/php/conf.d/docker-php-logs.ini

WORKDIR /var/www

COPY composer.* .
RUN composer install --no-dev --optimize-autoloader

COPY . .
COPY public/ html/

RUN chown -R www-data:www-data storage bootstrap/cache
EXPOSE 80
CMD php artisan storage:link || true && \
    php artisan config:cache && \
    php route:cache && \
    apache2-foreground