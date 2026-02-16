FROM php:8.5-apache
ARG APACHE_DOCUMENT_ROOT=/var/www/public

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
    apt-get update && apt-get install -y libpq-dev git unzip zip && \
    docker-php-ext-install pdo pdo_pgsql && \
    rm -rf /var/lib/apt/lists/* && a2enmod rewrite && \
    sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}}!g' /etc/apache2/sites-available/*.conf && \
    sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf && \
    echo "log_errors = On" >> /usr/local/etc/php/conf.d/docker-php-logs.ini && \
    echo "error_log = /proc/self/fd/2" >> /usr/local/etc/php/conf.d/docker-php-logs.ini

WORKDIR /var/www

COPY . .
RUN composer install --no-dev --optimize-autoloader

RUN chown -R www-data:www-data storage bootstrap/cache
EXPOSE 80
CMD php artisan storage:link || true && \
    php artisan config:cache && \
    php artisan route:cache && \
    apache2-foreground